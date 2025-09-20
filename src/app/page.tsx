import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-4xl font-bold">Hi all World</h1>
      <div className="flex justify-center">
        <Button className="mt-4 items-center justify-center cursor-pointer">
          Click me
        </Button>
      </div>
    </div>
  );
}
