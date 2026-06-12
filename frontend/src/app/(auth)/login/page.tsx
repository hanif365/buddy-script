import Image from "next/image";
import AuthShapes from "@/components/AuthShapes";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="relative z-[1] overflow-hidden bg-canvas py-[100px] max-md:py-[50px]">
      <AuthShapes />

      <div className="mx-auto w-full px-3 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
        <div className="-mx-3 flex flex-wrap items-center">
          <div className="w-full px-3 lg:w-2/3">
            <Image
              src="/images/login.png"
              alt=""
              width={1269}
              height={1240}
              priority
              sizes="(min-width: 62rem) 66vw, 100vw"
              className="h-auto w-full max-w-[620px]"
            />
          </div>
          <div className="w-full px-3 lg:w-1/3">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
