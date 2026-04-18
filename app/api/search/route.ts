import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { normalizePartNo } from '@/lib/part-number';

const prisma = new PrismaClient();

type SupplierPriceView = {
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  costAmount: number;
  currency: string;
  totalCostAmount: number;
  availableQty: number | null;
  leadTimeDays: number | null;
  stockStatus: string;
  isPreferred: boolean;
};

function rankSupplierPrice(prices: SupplierPriceView[]) {
  if (prices.length === 0) return null;

  const scored = prices.map((p) => {
    const priceScore = p.totalCostAmount;
    const leadTimeScore = p.leadTimeDays ?? 999;
    const preferredBonus = p.isPreferred ? -50 : 0;
    const stockBonus = p.stockStatus === 'in_stock' ? -30 : 0;

    const finalScore = priceScore + leadTimeScore * 10 + preferredBonus + stockBonus;

    return { ...p, finalScore };
  });

  scored.sort((a, b) => a.finalScore - b.finalScore);
  return scored[0];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() ?? '';

    if (!query) {
      return NextResponse.json(
        { ok: false, error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    const normalized = normalizePartNo(query);

    // log search
    await prisma.searchLog.create({
      data: {
        queryRaw: query,
        queryNormalized: normalized,
        resultCount: 0,
      },
    });

    // 1) exact match
    const exactProduct = await prisma.product.findUnique({
      where: {
        normalizedPartNo: normalized,
      },
      include: {
        supplierPrices: {
          include: {
            supplier: true,
          },
        },
        crossRefsFrom: {
          include: {
            toProduct: {
              include: {
                supplierPrices: {
                  include: {
                    supplier: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (exactProduct) {
      const supplierPrices: SupplierPriceView[] = exactProduct.supplierPrices.map((sp) => ({
        supplierId: sp.supplierId,
        supplierName: sp.supplier.name,
        supplierCode: sp.supplier.code,
        costAmount: Number(sp.costAmount),
        currency: sp.currency,
        totalCostAmount: Number(sp.totalCostAmount),
        availableQty: sp.availableQty,
        leadTimeDays: sp.leadTimeDays,
        stockStatus: sp.stockStatus,
        isPreferred: sp.isPreferred,
      }));

      const bestSupplier = rankSupplierPrice(supplierPrices);

      const alternatives = exactProduct.crossRefsFrom.map((ref) => {
        const alt = ref.toProduct;
        const altBestSupplier = rankSupplierPrice(
          alt.supplierPrices.map((sp) => ({
            supplierId: sp.supplierId,
            supplierName: sp.supplier.name,
            supplierCode: sp.supplier.code,
            costAmount: Number(sp.costAmount),
            currency: sp.currency,
            totalCostAmount: Number(sp.totalCostAmount),
            availableQty: sp.availableQty,
            leadTimeDays: sp.leadTimeDays,
            stockStatus: sp.stockStatus,
            isPreferred: sp.isPreferred,
          }))
        );

        return {
          id: alt.id,
          partNo: alt.partNo,
          brand: alt.brand,
          category: alt.category,
          title: alt.title,
          relationType: ref.relationType,
          confidenceScore: ref.confidenceScore ? Number(ref.confidenceScore) : null,
          note: ref.note,
          bestSupplier: altBestSupplier,
        };
      });

      await prisma.searchLog.updateMany({
        where: {
          queryRaw: query,
          queryNormalized: normalized,
        },
        data: {
          resultCount: 1 + alternatives.length,
          selectedProductId: exactProduct.id,
        },
      });

      return NextResponse.json({
        ok: true,
        type: 'exact',
        query,
        normalized,
        product: {
          id: exactProduct.id,
          partNo: exactProduct.partNo,
          brand: exactProduct.brand,
          category: exactProduct.category,
          title: exactProduct.title,
          titleTh: exactProduct.titleTh,
          titleEn: exactProduct.titleEn,
          spec: exactProduct.spec,
          description: exactProduct.description,
          unit: exactProduct.unit,
          bestSupplier,
          supplierOptions: supplierPrices,
        },
        alternatives,
      });
    }

    // 2) partial match
    const partialProducts = await prisma.product.findMany({
      where: {
        OR: [
          { partNo: { contains: query, mode: 'insensitive' } },
          { normalizedPartNo: { contains: normalized, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      include: {
        supplierPrices: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: {
        isFeatured: 'desc',
      },
    });

    if (partialProducts.length > 0) {
      const results = partialProducts.map((product) => {
        const supplierPrices: SupplierPriceView[] = product.supplierPrices.map((sp) => ({
          supplierId: sp.supplierId,
          supplierName: sp.supplier.name,
          supplierCode: sp.supplier.code,
          costAmount: Number(sp.costAmount),
          currency: sp.currency,
          totalCostAmount: Number(sp.totalCostAmount),
          availableQty: sp.availableQty,
          leadTimeDays: sp.leadTimeDays,
          stockStatus: sp.stockStatus,
          isPreferred: sp.isPreferred,
        }));

        return {
          id: product.id,
          partNo: product.partNo,
          brand: product.brand,
          category: product.category,
          title: product.title,
          titleTh: product.titleTh,
          titleEn: product.titleEn,
          spec: product.spec,
          bestSupplier: rankSupplierPrice(supplierPrices),
        };
      });

      await prisma.searchLog.updateMany({
        where: {
          queryRaw: query,
          queryNormalized: normalized,
        },
        data: {
          resultCount: results.length,
        },
      });

      return NextResponse.json({
        ok: true,
        type: 'partial',
        query,
        normalized,
        results,
      });
    }

    return NextResponse.json({
      ok: true,
      type: 'not_found',
      query,
      normalized,
      results: [],
      message: 'No matching part found',
    });
  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}