"use client";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "@/next-seo.config";

export default function ClientDefaultSeo() {
  console.log(defaultSEO);
  return <DefaultSeo {...defaultSEO} />;
}
