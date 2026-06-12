import Image from "next/image";
import AuthShapes from "@/components/AuthShapes";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="relative z-[1] overflow-hidden bg-canvas py-[100px] max-md:py-[50px]">
      <AuthShapes />

      <div className="mx-auto w-full px-3 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
        <div className="-mx-3 flex flex-wrap items-start">
          <div className="w-full px-3 lg:w-2/3">
            <Image
              src="/images/registration.png"
              alt=""
              width={1928}
              height={1422}
              priority
              sizes="(min-width: 62rem) 66vw, 100vw"
              className="h-auto w-full lg:mt-32"
            />
          </div>
          <div className="w-full px-3 lg:w-1/3">
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
