import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button.tsx";
import { createClient } from "@my-app/graphql-client";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [prefecture, setPrefecture] = useState<string | undefined>();
  const client = createClient({ url: "/gql" });
  useEffect(() => {
    (async () => {
      const data = await client.query({
        prefecture: {
          __args: { code: count },
          name: true,
          nameKana: true,
        },
      });
      setPrefecture(data.prefecture?.name);
    })();
  }, [count]);
  return (
    <div>
      <p className="py-2 text-2xl">{count}:{prefecture ?? ""}</p>
      <Button
        onClick={() => setCount(count + 1)}
      >
        Increment
      </Button>
    </div>
  );
}
