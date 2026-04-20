import Page from "@/components/layout/Page";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useLocale } from "next-intl";
export default function AboutPage() {
  const locale = useLocale();

  return (
    <Page
      title="About MRT Supplier"
      subtitle="Industrial B2B supply infrastructure for filtration, bearings, and precision parts."
      actions={
        <>
          <Button asChild variant="secondary">
          <Link href="/contact">Contact</Link>
          </Button>

          <Button asChild>
          <Link href={`/${locale}/products`}>Search</Link>
          </Button>
        </>
      }
    >
      <Section className="border-b border-neutral-900">
        <h3 className="h3">What we do</h3>
        <p className="body mt-3 max-w-3xl">
          We help factories source reliable parts with a search-first RFQ flow.
        </p>
      </Section>

      <Section className="bg-neutral-950/40">
        <h3 className="h3">How we work</h3>
        <p className="body mt-3 max-w-3xl">
          Search → Add to Quote → Submit RFQ. Fast, controlled, and scalable.
        </p>
      </Section>
    </Page>
  );
}
