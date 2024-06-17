"use client";

import { useState } from "react";
import { action } from "./action";

export default function HelperPage() {
  const [data, setData] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const datainput = formData.get("datainput") as string;
    const res = await action(datainput);
    setData(res.toString());
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input type="text" name="datainput" className="outline" />
        <button type="submit" className="m-2">
          Submit
        </button>
      </form>
      <h3>{data}</h3>
    </div>
  );
}
