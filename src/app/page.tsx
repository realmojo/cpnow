import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">
        지금 이 순간
        <br /> 가장 똑똑하게 소비하는 방법
      </h1>
      <div className="mt-4 flex w-full max-w-sm items-center space-x-2">
        <Input type="text" />
        <Button size="icon">
          <Search />
        </Button>
      </div>
    </div>
  );
}
