import { ENDPOINTS } from "@constants/endpoints";
import { useState } from "react";

export default function Add() {
  const [name, setName] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();

    await fetch(ENDPOINTS.categories, {
      method: "POST",
      body: JSON.stringify({ name, enable: false }),
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <div>
        <input name="name" onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
}
