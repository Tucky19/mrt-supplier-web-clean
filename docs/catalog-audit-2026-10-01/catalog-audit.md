# MRT Supplier — ตรวจข้อมูลสินค้าและหน่วยมิลลิเมตร (1 ต.ค. 2026)

ตรวจโครงสร้างข้อมูลสินค้าที่ใช้งานจริงครบ 800 รายการ ตรวจขนาดกับหน้าผู้ผลิต MANN-FILTER ได้ 86 รายการ การตรวจโครงสร้างไม่ได้ยืนยันว่าสินค้าทุกรายการถูกต้องจากผู้ผลิตแล้ว

## สิ่งที่แก้

- แสดงและค้นหาขนาดเชิงเส้นด้วย mm; รักษาเกลียวและหน่วยความดันตามมาตรฐานเดิม
- BFU 900 x: OD 85 / ID 13.3 / H 145 mm; แบบไส้เปลี่ยน
- เลิกเติม Spin-on อัตโนมัติเมื่อข้อมูลชนิดไม่ระบุ
- เลิกใช้ยี่ห้อสินค้าหลักแทนยี่ห้อที่ไม่ทราบในตาราง Cross Reference
- C 14 200 → P778984: ระบุ Donaldson แต่ยังไม่ยืนยันว่าใช้แทนกันได้
- ไม่อ่านขนาดกรองสี่เหลี่ยมเป็น ID × OD × Width ของตลับลูกปืน
- P537876/P537877: กักขนาดสี่เหลี่ยมเดิมที่ขัดกับชนิด RadialSeal ไว้รอตรวจ ไม่ใช้ค้นหาและไม่เดาขนาดแทน
- เพิ่มประเภทสินค้าทั้งหมด ตลับลูกปืน ไส้แยกน้ำมันอากาศ และช่องความกว้าง; หน่วย mm

## ผลตรวจและงานคงเหลือ

- ค้นหาได้จากขนาด/เกลียว: 420 รายการ
- missing_product_image: 285 รายการ
- missing_official_product_url: 307 รายการ
- no_searchable_linear_dimensions: 380 รายการ
- cross_references_need_verification: 304 รายการ
- cross_reference_brand_unspecified: 48 รายการ
- generic_or_missing_category: 55 รายการ
- missing_image_file: 1 รายการ
- conflicting_dimensions_quarantined: 2 รายการ
- ภาพยังไม่ได้เปรียบเทียบกับภาพผู้ผลิตใหม่ทุกรายการ; ตรวจเพียงการมีไฟล์/ภาพ placeholder
- Cross Reference ที่ไม่มีหลักฐานยังคงรอตรวจ ไม่เปลี่ยนเป็น verified อัตโนมัติ
- รายการที่ไม่มีขนาดต้องเติมจากเอกสารตรงรุ่นก่อนจึงจะค้นหาด้วยขนาดได้ การแปลงหน่วยไม่สามารถเติมข้อมูลที่ไม่มีได้
- หน้าผู้ผลิต Donaldson ที่ทดสอบส่ง HTML ตารางสเปกว่าง ต้องใช้ PDF ตรงรุ่นหรืออ่านข้อมูลที่โหลดบนหน้าเว็บเพิ่มเติม

## รายการทั้งหมด

| Part No. | Brand | ขนาดตรวจจาก MANN | ประเด็นรอตรวจ |
|---|---|---|---|
| P500138 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010051 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P505951 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010001 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010002 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P557780 | Donaldson | — | missing_official_product_url |
| R011739 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P502652 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P552561 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P552562 | Donaldson | — | missing_official_product_url |
| P551858 | Donaldson | — | missing_official_product_url |
| P582086 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P552216 | Donaldson | — | missing_official_product_url |
| R010083 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R005743 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R005748 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R004212 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R004213 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P502593 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P114931 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P181039 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P553009 | Donaldson | — | missing_official_product_url |
| P638095 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P643271 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R000164 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R000165 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550929 | Donaldson | — | missing_official_product_url |
| R010050 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X012252 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| DBA5292 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P633483 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P500941 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P551100 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010055 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P566999 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X802236 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P566983 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P551132 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550550 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X012193 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X011409 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R000585 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R000586 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010016 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010046 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R000749 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010045 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P502432 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010059 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010012 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010018 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550317 | Donaldson | — | missing_official_product_url |
| P550945 | Donaldson | — | missing_official_product_url |
| P954604 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550820 | Donaldson | — | missing_official_product_url |
| P777638 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P145701 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P551158 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010043 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010034 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010067 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010017 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010084 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R005709 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R005714 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P556352 | Donaldson | — | missing_official_product_url |
| P555706 | Donaldson | — | missing_official_product_url |
| P502540 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P781102 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P781098 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P573481 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P551808 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R011751 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P554560 | Donaldson | — | missing_official_product_url |
| P553505 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R011619 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550851 | Donaldson | — | missing_official_product_url |
| P552075 | Donaldson | — | missing_official_product_url |
| P502651 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P761045 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550202 | Donaldson | — | missing_official_product_url |
| P608306 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P608305 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P561333 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P778905 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P778906 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X011398 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010036 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R002323 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R002324 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R010061 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550778 | Donaldson | — | missing_official_product_url |
| P551034 | Donaldson | — | missing_official_product_url |
| P581789 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P635977 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P641355 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X011845 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| DBF9143 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R005086 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X773027 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P637250 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P621984 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R003911 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| R003923 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P637251 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P643762 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| X011896 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P555461 | donaldson | — | cross_references_need_verification |
| X770088 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| B105006 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| B105012 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| B105036 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| B120572 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| C085002 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| C105003 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P112212 | donaldson | — | cross_references_need_verification |
| P119373 | donaldson | — | cross_references_need_verification |
| P119375 | donaldson | — | cross_references_need_verification |
| P123160 | donaldson | — | cross_references_need_verification |
| P127315 | donaldson | — | cross_references_need_verification |
| P131394 | donaldson | — | cross_references_need_verification |
| P134354 | donaldson | — | cross_references_need_verification |
| P142810 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P145756 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P158670 | donaldson | — | cross_references_need_verification |
| P181009 | donaldson | — | cross_references_need_verification |
| P181036 | donaldson | — | cross_references_need_verification |
| P181106 | donaldson | — | cross_references_need_verification |
| P181118 | donaldson | — | cross_references_need_verification |
| P500186 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500187 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500913 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500915 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500940 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P828889 | donaldson | — | cross_references_need_verification |
| P550148 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P550084 | Donaldson | — | cross_references_need_verification |
| P558615 | donaldson | — | cross_references_need_verification |
| C105004 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P565059 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P782105 | donaldson | — | cross_references_need_verification |
| P554620 | donaldson | — | cross_references_need_verification |
| P554685 | donaldson | — | cross_references_need_verification |
| P559000 | donaldson | — | cross_references_need_verification |
| P550881 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P771561 | donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P782104 | donaldson | — | cross_references_need_verification |
| P780024 | donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P778972 | donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P780012 | donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P778984 | donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P778994 | donaldson | — | cross_references_need_verification |
| P780036 | donaldson | — | cross_references_need_verification |
| P782108 | donaldson | — | cross_references_need_verification |
| P782109 | donaldson | — | cross_references_need_verification |
| P551102 | donaldson | — | cross_references_need_verification |
| P181059 | donaldson | — | cross_references_need_verification |
| P551670 | donaldson | — | cross_references_need_verification |
| P550777 | donaldson | — | cross_references_need_verification |
| P550615 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502438 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P181063 | donaldson | — | cross_references_need_verification |
| P551311 | donaldson | — | cross_references_need_verification |
| P552819 | donaldson | — | cross_references_need_verification |
| P551624 | donaldson | — | cross_references_need_verification |
| P550848 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P553500 | donaldson | — | no_searchable_linear_dimensions |
| P551426 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550318 | donaldson | — | cross_references_need_verification |
| P522452 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P822768 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P829333 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502084 | donaldson | — | no_searchable_linear_dimensions |
| P556005 | donaldson | — | cross_references_need_verification |
| P554403 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P775749 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P552341 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P550520 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P502163 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502465 | donaldson | — | no_searchable_linear_dimensions |
| P550035 | Donaldson | — | cross_references_need_verification |
| P753388 | donaldson | — | no_searchable_linear_dimensions |
| P558329 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P556916 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P550588 | donaldson | — | cross_references_need_verification |
| P550920 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P551550 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550410 | donaldson | — | cross_references_need_verification |
| P554407 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P556915 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P550020 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502072 | donaldson | — | no_searchable_linear_dimensions, generic_or_missing_category, cross_references_need_verification |
| P550008 | Donaldson | — | cross_references_need_verification |
| P551551 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502476 | donaldson | — | no_searchable_linear_dimensions |
| R011866 | donaldson | — | missing_image_file, generic_or_missing_category |
| P551436 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502039 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P170306 | donaldson | — | no_searchable_linear_dimensions |
| P550057 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P550065 | Donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification, cross_reference_brand_unspecified |
| P550086 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P550105 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P550132 | Donaldson | — | cross_references_need_verification |
| P550162 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P550222 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550223 | donaldson | — | cross_references_need_verification |
| P550226 | donaldson | — | cross_references_need_verification |
| P550227 | donaldson | — | cross_references_need_verification |
| P550268 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550365 | donaldson | — | cross_references_need_verification |
| P550367 | donaldson | — | cross_references_need_verification |
| P550372 | donaldson | — | cross_references_need_verification |
| P550382 | donaldson | — | cross_references_need_verification |
| P550388 | donaldson | — | cross_references_need_verification |
| P550391 | donaldson | — | cross_references_need_verification |
| P550408 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550416 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550425 | Donaldson | — | cross_references_need_verification |
| P550428 | donaldson | — | cross_references_need_verification |
| P550440 | Donaldson | — | cross_references_need_verification |
| P550445 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550467 | donaldson | — | cross_references_need_verification |
| P550478 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550519 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550529 | donaldson | — | cross_references_need_verification |
| P550576 | donaldson | — | no_searchable_linear_dimensions |
| P550595 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550596 | donaldson | — | cross_references_need_verification |
| P550639 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550708 | donaldson | — | cross_references_need_verification |
| P550719 | donaldson | — | cross_references_need_verification |
| P550762 | donaldson | — | cross_references_need_verification |
| P550769 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550774 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P558000 | donaldson | — | cross_references_need_verification |
| P558616 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P559100 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P559128 | donaldson | — | no_searchable_linear_dimensions |
| P559740 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P181034 | Donaldson | — | cross_references_need_verification |
| P181035 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P181042 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P181045 | donaldson | — | cross_references_need_verification |
| P181046 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P181049 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P181052 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P164166 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P164375 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P164378 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P164384 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500194 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P500195 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P500196 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P500202 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P502009 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502016 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502083 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502088 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502170 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502190 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P502382 | donaldson | — | no_searchable_linear_dimensions |
| P502422 | donaldson | — | no_searchable_linear_dimensions |
| P502458 | donaldson | — | no_searchable_linear_dimensions |
| P502463 | donaldson | — | no_searchable_linear_dimensions |
| P502464 | donaldson | — | no_searchable_linear_dimensions |
| P502502 | donaldson | — | no_searchable_linear_dimensions |
| P502504 | donaldson | — | no_searchable_linear_dimensions |
| P502516 | donaldson | — | no_searchable_linear_dimensions |
| P502594 | donaldson | — | no_searchable_linear_dimensions |
| P502649 | donaldson | — | no_searchable_linear_dimensions, generic_or_missing_category |
| P505957 | donaldson | — | no_searchable_linear_dimensions |
| P526428 | donaldson | — | no_searchable_linear_dimensions |
| P526432 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P526840 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P527596 | Donaldson | — | cross_references_need_verification |
| P532473 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P532499 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P532500 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P532501 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P532502 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P532503 | Donaldson | — | cross_references_need_verification |
| P532504 | Donaldson | — | cross_references_need_verification |
| P536492 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P537405 | donaldson | — | no_searchable_linear_dimensions |
| P537876 | donaldson | — | no_searchable_linear_dimensions, conflicting_dimensions_quarantined |
| P537877 | donaldson | — | no_searchable_linear_dimensions, conflicting_dimensions_quarantined, cross_references_need_verification |
| P538259 | donaldson | — | no_searchable_linear_dimensions, generic_or_missing_category |
| P119374 | Donaldson | — | cross_references_need_verification |
| P158661 | Donaldson | — | cross_references_need_verification |
| P158669 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P162205 | donaldson | — | no_searchable_linear_dimensions |
| P165569 | donaldson | — | no_searchable_linear_dimensions |
| P165705 | donaldson | — | no_searchable_linear_dimensions |
| P181056 | donaldson | — | cross_references_need_verification |
| P181080 | donaldson | — | cross_references_need_verification |
| P532966 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P536457 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P550900 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P554005 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P822769 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P550958 | donaldson | — | generic_or_missing_category, cross_references_need_verification |
| P553000 | Donaldson | — | cross_references_need_verification |
| P181104 | donaldson | — | cross_references_need_verification |
| P554004 | donaldson | — | cross_references_need_verification |
| P557440 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P777868 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P777869 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P181054 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P181064 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P181082 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P181103 | Donaldson | — | cross_references_need_verification |
| P181191 | donaldson | — | cross_references_need_verification |
| P169478 | donaldson | — | no_searchable_linear_dimensions |
| P171734 | donaldson | — | no_searchable_linear_dimensions |
| P171735 | donaldson | — | no_searchable_linear_dimensions |
| P173689 | donaldson | — | no_searchable_linear_dimensions |
| C 1250 | MANN-FILTER | ตรวจแล้ว | cross_references_need_verification, cross_reference_brand_unspecified |
| C 1337 | MANN-FILTER | — | cross_references_need_verification, cross_reference_brand_unspecified |
| C 1633/1 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| LB 962/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 719/5 | MANN-FILTER | ตรวจแล้ว | cross_references_need_verification, cross_reference_brand_unspecified |
| W 920/21 | MANN-FILTER | ตรวจแล้ว | cross_references_need_verification, cross_reference_brand_unspecified |
| W 940/5 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category, cross_references_need_verification, cross_reference_brand_unspecified |
| C 20 500 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| CF 500 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 14 200 | MANN-FILTER | ตรวจแล้ว | cross_references_need_verification |
| C 16 400 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| CF 400 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 1112/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category, cross_references_need_verification, cross_reference_brand_unspecified |
| C 25 900 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| CF 1830 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 75/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 713 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 30 850/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 25 710/3 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category, cross_references_need_verification, cross_reference_brand_unspecified |
| C 23 632/1 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 23 610 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 23 115 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 21 600 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 21 138/1 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 20 325/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category, cross_references_need_verification, cross_reference_brand_unspecified |
| C 20 105 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 1760 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 15 300 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| CF 710 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| CF 610 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| CF 300 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| H 1290/1 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| CF 200 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category, cross_references_need_verification, cross_reference_brand_unspecified |
| HU 12 007 x | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| H 729 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 30 810/3 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| CF 810 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| C 30 703 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| HU 12 008 x | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 11 102/36 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 11 102 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 11 102/37 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| HU 931/5 x | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| HU 7016 x | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| LB 962/21 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| LB 1374/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| LB 13 145/3 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| LB 11 102/2 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 950 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 940/1 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 962/14 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| W 962 | MANN-FILTER | ตรวจแล้ว | generic_or_missing_category |
| WDK 725 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WDK 11 102/9 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 962 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 950 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WDK 962/16 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 13 145 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 940 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 920 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 1374 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WDK 9002 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| W 1160 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| W 13 145/3 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| W 940 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WK 842/2 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WK 723 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WK 1080/7 x | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WK 1060/1 | MANN-FILTER | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| TB 1396/5 x | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| BFU 900 x | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| TB 1374 x | MANN-FILTER | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| PL 420 x | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| C 1132 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P553004 | Donaldson | — | cross_references_need_verification |
| P551315 | Donaldson | — | cross_references_need_verification |
| FS36230 | Fleetguard | — | missing_product_image, missing_official_product_url |
| FS36210 | Fleetguard | — | missing_product_image, missing_official_product_url |
| LF14000NN | Fleetguard | — | cross_references_need_verification, cross_reference_brand_unspecified |
| FS1242 | Fleetguard | — | no_searchable_linear_dimensions |
| P551864 | Donaldson | — | cross_references_need_verification |
| P551329 | Donaldson | — | cross_references_need_verification |
| P551425 | Donaldson | — | cross_references_need_verification |
| P551807 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P553191 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P823295 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P182049 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P116446 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P128408 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P550880 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P164594 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P163542 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P164381 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500914 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P150135 | Donaldson | — | cross_references_need_verification |
| P158671 | Donaldson | — | cross_references_need_verification |
| P181119 | Donaldson | — | cross_references_need_verification |
| P164168 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P164178 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P164703 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P167410 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P167413 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P170587 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P170601 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P170606 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P170612 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P171574 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P171583 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P171715 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P171742 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P171846 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P172463 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P172464 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P172465 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P172466 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P172467 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P173038 | Donaldson | — | cross_references_need_verification |
| P173042 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P173055 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P173238 | Donaldson | — | cross_references_need_verification |
| P174243 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P174915 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P175120 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502270 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P552006 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P550687 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P637260 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P551065 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550422 | Donaldson | — | cross_references_need_verification |
| P552564 | Donaldson | — | cross_references_need_verification |
| P552024 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P780006 | Donaldson | — | cross_references_need_verification |
| P165672 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502424 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502423 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P551257 | Donaldson | — | cross_references_need_verification |
| P953215 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P105612 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P821575 | Donaldson | — | cross_references_need_verification |
| P553771 | Donaldson | — | cross_references_need_verification |
| P502466 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P551312 | Donaldson | — | cross_references_need_verification |
| P555570 | Donaldson | — | cross_references_need_verification |
| P165762 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P778335 | Donaldson | — | cross_references_need_verification |
| P551423 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P531520 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P552020 | Donaldson | — | cross_references_need_verification |
| P551604 | Donaldson | — | cross_references_need_verification |
| P556064 | Donaldson | — | cross_references_need_verification |
| P173789 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P583087 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P165876 | Donaldson | — | cross_references_need_verification |
| P551103 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550816 | Donaldson | — | cross_references_need_verification |
| P551381 | Donaldson | — | cross_references_need_verification |
| P785390 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P601886 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P166255 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P765075 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P166136 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P537449 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P500199 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P607965 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P608676 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P781398 | Donaldson | — | cross_references_need_verification |
| P781039 | Donaldson | — | cross_references_need_verification |
| P781399 | Donaldson | — | cross_references_need_verification |
| P812160 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550949 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502653 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P902311 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P165659 | Donaldson | — | no_searchable_linear_dimensions |
| P551006 | Donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification, cross_reference_brand_unspecified |
| P553880 | Donaldson | — | no_searchable_linear_dimensions |
| P550903 | Donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification, cross_reference_brand_unspecified |
| P550779 | Donaldson | — | no_searchable_linear_dimensions |
| P502233 | Donaldson | — | no_searchable_linear_dimensions |
| P551130 | Donaldson | — | no_searchable_linear_dimensions |
| P836245 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P763415 | Donaldson | — | no_searchable_linear_dimensions |
| P777639 | Donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P785589 | Donaldson | — | no_searchable_linear_dimensions |
| P775687 | Donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P821938 | Donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P601560 | Donaldson | — | no_searchable_linear_dimensions |
| P812924 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P827653 | Donaldson | — | cross_references_need_verification |
| P554105 | Donaldson | — | cross_references_need_verification |
| R010042 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502479 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550523 | Donaldson | — | cross_references_need_verification |
| P537893 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P556745 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P829332 | Donaldson | — | cross_references_need_verification |
| R000958 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502477 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550944 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502478 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550748 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P780522 | Donaldson | — | cross_references_need_verification |
| P780523 | Donaldson | — | cross_references_need_verification |
| P124046 | Donaldson | — | cross_references_need_verification |
| P551000 | Donaldson | — | cross_references_need_verification |
| P553200 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P822858 | Donaldson | — | cross_references_need_verification |
| P553411 | Donaldson | — | cross_references_need_verification |
| P551422 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P822686 | Donaldson | — | cross_references_need_verification |
| P533781 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P551712 | Donaldson | — | cross_references_need_verification |
| P550406 | Donaldson | — | cross_references_need_verification |
| P555680 | Donaldson | — | cross_references_need_verification |
| P550939 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550390 | Donaldson | — | cross_references_need_verification |
| P551433 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P551428 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550909 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P557380 | Donaldson | — | cross_references_need_verification |
| P102745 | Donaldson | — | cross_references_need_verification |
| P556287 | Donaldson | — | cross_references_need_verification |
| P550106 | Donaldson | — | cross_references_need_verification |
| P550335 | Donaldson | — | cross_references_need_verification |
| P558600 | Donaldson | — | cross_references_need_verification |
| P551352 | Donaldson | — | cross_references_need_verification |
| P502913 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P550750 | Donaldson | — | cross_references_need_verification |
| P550484 | Donaldson | — | cross_references_need_verification |
| P554770 | Donaldson | — | cross_references_need_verification |
| P550048 | Donaldson | — | cross_references_need_verification |
| P556245 | Donaldson | — | cross_references_need_verification |
| P550026 | Donaldson | — | cross_references_need_verification |
| P550012 | Donaldson | — | cross_references_need_verification |
| P166416 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P505982 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P502643 | Donaldson | — | cross_references_need_verification, cross_reference_brand_unspecified |
| P171520 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502193 | Donaldson | — | cross_references_need_verification |
| P502522 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P502552 | Donaldson | — | no_searchable_linear_dimensions, generic_or_missing_category |
| X770691 | Donaldson | — | no_searchable_linear_dimensions |
| R010077 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| R011836 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| R002290 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P534436 | Donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P158678 | Donaldson | — | cross_references_need_verification |
| R800103 | Donaldson | — | cross_references_need_verification |
| P182034 | Donaldson | — | cross_references_need_verification |
| P535365 | Donaldson | — | cross_references_need_verification |
| B105002 | donaldson | — | no_searchable_linear_dimensions |
| P169078 | donaldson | — | no_searchable_linear_dimensions |
| P550912 | donaldson | — | no_searchable_linear_dimensions |
| P550932 | donaldson | — | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| P551039 | donaldson | — | no_searchable_linear_dimensions |
| P582263 | donaldson | — | no_searchable_linear_dimensions |
| P785590 | donaldson | — | no_searchable_linear_dimensions |
| X770689 | donaldson | — | no_searchable_linear_dimensions |
| P565149 | donaldson | — | no_searchable_linear_dimensions |
| R011812 | donaldson | — | no_searchable_linear_dimensions |
| P502363 | donaldson | — | no_searchable_linear_dimensions |
| P583856 | donaldson | — | no_searchable_linear_dimensions |
| P955606 | donaldson | — | no_searchable_linear_dimensions |
| P959083 | donaldson | — | no_searchable_linear_dimensions |
| P777871 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P777875 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| P581958 | donaldson | — | no_searchable_linear_dimensions |
| P550460 | donaldson | — | no_searchable_linear_dimensions |
| P550904 | donaldson | — | no_searchable_linear_dimensions |
| P551424 | donaldson | — | no_searchable_linear_dimensions |
| P777551 | donaldson | — | no_searchable_linear_dimensions, cross_references_need_verification |
| CF 1600 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| WD 962/32 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| FCR48-11/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR55-17-8.9.10.11/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| SF0816/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR50-30-2 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR50-42-2/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR44-9/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR48-39-6/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| SF0724/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| X10-FCR55-5/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| SF1412/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| 45TMK804X | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| 55TMK804X/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| SF0815/4E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| SF0721/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR54-60-10/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR54-60-13/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR54-10.46.58/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR50-10/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR50-1/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR54-13.19.47.48/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR50-17-8/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR44-21/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR54-33-1/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR47-8-4/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| SF0914/4E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| FCR55-1/2E | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS48-33K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS68-47K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS58-37K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS48-29K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS52-28K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TK35-2RS | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS55-35K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS47-40K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS47-31K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS55-38K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS55-34K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS48-37K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS60-42K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS87-43K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS62-42K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS54-40K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS78-54K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS48-45K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS48-43K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS78-40K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS78-48K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS68-32K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS60-30K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS48-30K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS60-50K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS90-60K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS70-48K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS60-28K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS32-1K | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| TKS68-26U | MRK | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, cross_references_need_verification |
| X770688 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| CA3530 | Other | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| C1140 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| FHR060-X1 | Other | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, generic_or_missing_category |
| G100319 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KW2140C1 | Other | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| W1374/6 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| P821883 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 4570092941 | MANN-FILTER | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P785965 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| DF5112 | SOTRAS | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| AA90138-R | Fleetguard | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P533930 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P608766 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| C18902 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| 4900053601 | MANN-FILTER | — | missing_product_image, missing_official_product_url |
| CB3030 | Other | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| G065424 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P502667 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| C1574 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| P166387 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| DF5019 | SOTRAS | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P626096 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| LB13145/21 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| P555776 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| PL250 | MANN-FILTER | ตรวจแล้ว | ยังต้องตรวจหลักฐานสินค้า/ภาพ |
| R010039 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P181073 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P164352 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P502441 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P771555 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| AA90145R | Fleetguard | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P502269 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P551852 | Donaldson | — | missing_official_product_url |
| P173489 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P176324 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P136255 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| C085004 | Donaldson | — | missing_official_product_url |
| P763995 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 3970040989 | Other | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| WD724/6 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| X002251 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P821963 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550849 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| W712 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| P772579 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P551421 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| C1368 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| P552603 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P133138 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| FP1111 | Other | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| SA6069 | SOTRAS | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550087 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550861 | Donaldson | — | missing_official_product_url |
| TB1394/1X | MANN-FILTER | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, generic_or_missing_category |
| P552040 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P789077 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| CF1280 | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| P550625 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P550959 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P788912 | Donaldson | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1AIS068 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| Z-OPL-01 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-OIS054 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-FHN284 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-OHN275 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-OKS449 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-FIS026 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-FIS433 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| Z-OPL-05 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 1-OMD180 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, generic_or_missing_category |
| 1-OKS440 | FULL | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 7312BL1G | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| UCF207D1 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 33213U | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NU212G1C3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NF309G1 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 7309BL1G | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6307LLU | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6016ZZ | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 7313BL1G | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6210C3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6205CM | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6205C3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6310ZZ | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| DF0766LLUACS32 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6206LLU | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 7307BL1G | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 7310BL1G | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NU305EG1C3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| UCFL208-108D1 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NJ314ET2XC3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NF307EAT2 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6210ZZ | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NU2310EG1 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6207LLB | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6205ZZCM/5K | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NJ210ET2XC3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| NU2210EG1C3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6016CM | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 7304BL1G | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6206ZZ | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| 6205ZC3 | NTN | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BA343 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BO241 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF167 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF171 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF158 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BO207 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF134 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF157 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BO185 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF155 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BO181 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF141 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BA316 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BO102 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF101 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BF117 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| BO234 | BLACK CLUB | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KAS297 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KSE1047 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KAS282 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KHL1178 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KFW6698 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KHL1124 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KHL1728 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KAS199 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KH593 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KF007 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KH560 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KA043 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions, generic_or_missing_category |
| KH140A | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KH692LL | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| KHL1080 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| AF26531 | Fleetguard | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| AF26532 | Fleetguard | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| LE5001X | MANN-FILTER | ตรวจแล้ว | missing_product_image |
| AF26614 | Fleetguard | — | missing_product_image, missing_official_product_url |
| AF26613 | Fleetguard | — | missing_product_image, missing_official_product_url |
| KAS345 | K-FLO | — | missing_product_image, missing_official_product_url, no_searchable_linear_dimensions |
| P552050 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P550225 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P551853 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P502007 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P550453 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P551026 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P781466 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P784473 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P954895 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| HU721XKIT | MANN-FILTER | ตรวจแล้ว | cross_references_need_verification |
| CU31001 | MANN-FILTER | ตรวจแล้ว | cross_references_need_verification |
| P955737 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P506115 | Donaldson | — | missing_official_product_url, cross_references_need_verification |
| P903541 | Donaldson | — | missing_official_product_url, cross_references_need_verification |

## การทดสอบชุดแก้ไข

- TypeScript ผ่าน
- Next.js production build ผ่าน โดยใช้ URL ฐานข้อมูลจำลองบน localhost สำหรับขั้นตอน build เท่านั้น ไม่เชื่อม Production DB
- ทดสอบค้นหาจากขนาดของสินค้าทุกรายการที่มีข้อมูลได้ 420 รายการ ผ่าน
- ทดสอบ BFU 900 x ด้วย 85 / 13.3 / 145 mm และยืนยันว่า ID 133.096 mm ไม่พบรายการนี้
- ทดสอบผล HTML ที่เซิร์ฟเวอร์สร้าง 7 เส้นทาง: หน้าสินค้า TH/EN, dimension search, separator search, cross-reference brand, ขนาดรอตรวจ
- ทดสอบ Part Number, หลายเบอร์, exact reference และ autocomplete เดิม ผ่าน
- ข้อมูลที่ไม่มีหลักฐานและภาพสินค้าไม่ได้ถูกสร้างขึ้นหรือรับรองอัตโนมัติ
- ยังไม่ merge และยังไม่เปลี่ยน Production
