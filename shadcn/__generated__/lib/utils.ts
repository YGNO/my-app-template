import { clsx, type ClassValue } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** SSR対策で React.useId() 代わりに使用する。ライブラリ内で React.useId() を使用している箇所はこの関数で置き換える */
export function useClientId(prefix = "id") {
  const [id, setId] = useState<string | undefined>();
  useEffect(() => {
    setId(`${prefix}-${Math.random().toString(36).substring(2, 9)}`);
  }, [prefix]);
  return id;
}
