import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartForm } from "./AddToCartForm";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { where: { active: true }, orderBy: { name: "asc" } } },
  });

  if (!product || !product.active) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 text-zinc-400">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl">🧵</span>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-zinc-900">{product.name}</h1>
          {product.description && <p className="mt-3 text-zinc-500">{product.description}</p>}
          <AddToCartForm
            product={{
              id: product.id,
              name: product.name,
              image: product.images[0] ?? null,
              basePriceCents: product.basePriceCents,
            }}
            variants={product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              priceCents: v.priceCents,
              inventoryCount: v.inventoryCount,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
