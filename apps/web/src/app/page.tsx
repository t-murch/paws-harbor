import placeholderImage from "@/../public/paws-placeholder.jpg";
// import placeholderImage from "@/../public/paws-placeholder.png";
import Icon from "@/components/ux/Icon";
import Image from "next/image";

export default function Web() {
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
