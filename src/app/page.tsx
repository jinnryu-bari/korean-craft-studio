import { ClassCatalog } from "@/components/ClassCatalog";
import { CraftTabs } from "@/components/CraftTabs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCatalog } from "@/components/ProductCatalog";
import { craftClasses } from "@/mocks/classes";
import { crafts } from "@/mocks/crafts";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="pb-16">
        <CraftTabs
          panels={{
            products: <ProductCatalog crafts={crafts} />,
            classes: <ClassCatalog craftClasses={craftClasses} />,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
