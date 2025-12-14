import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            CPNOW
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare Coupang current price with its history.
          </p>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center gap-6">
          <Card className="w-full max-w-md shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle>Analyze Price</CardTitle>
              <CardDescription>
                Paste the product link from the search bar above to see the
                price history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input placeholder="Paste URL here..." className="flex-1" />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Analyze</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full flex justify-end p-4 bg-background border-t">
        <ModeToggle />
      </footer>
    </div>
  );
}
