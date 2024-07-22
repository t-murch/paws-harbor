import placeholderImage from "@/../public/paws-placeholder.jpg";
import Icon from "@/components/ux/Icon";
import Image from "next/image";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function Web() {
  function handleLogin() {
    fetch(`${API_HOST}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "user", password: "password" }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  function handleRegister() {
    fetch(`${API_HOST}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "user", password: "password" }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  return (
    <main className="home h-full w-full grid grid-rows-20 gap-2 items-center">
      <section className="content flex row-span-7">
        <div className="flex h-full w-full items-center justify-center">
          <Image alt="placeholder-image" src={placeholderImage} />
        </div>
      </section>
      <section className="h-full login row-span-6"></section>
      <section className="footer row-span-4">
        <div className="flex h-full w-full gap-2 items-center justify-center">
          <div className="flex h-16 w-16 rounded-full bg-secondary items-center justify-center">
            <Icon name="instagram" size={36} />
          </div>
        </div>
      </section>
    </main>
  );
}
