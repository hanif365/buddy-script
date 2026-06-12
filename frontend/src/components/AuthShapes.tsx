import Image from "next/image";

export default function AuthShapes() {
  return (
    <>
      <Image
        src="/images/shape1.svg"
        alt=""
        width={176}
        height={540}
        className="pointer-events-none absolute top-0 left-0 -z-[1] hidden h-auto w-[150px] lg:block"
      />
      <Image
        src="/images/shape2.svg"
        alt=""
        width={568}
        height={400}
        className="pointer-events-none absolute top-0 right-[20px] -z-[1] hidden h-auto w-[450px] lg:block"
      />
      <Image
        src="/images/shape3.svg"
        alt=""
        width={568}
        height={548}
        className="pointer-events-none absolute right-0 bottom-0 -z-[1] hidden h-auto w-[494px] lg:block"
      />
    </>
  );
}
