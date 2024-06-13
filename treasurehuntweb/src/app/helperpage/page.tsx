"use client";

import { action } from "./action";

export default function HelperPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const datainput = formData.get("datainput") as string;
    const res = await action(datainput);
    console.log(res);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input type="text" name="datainput" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
