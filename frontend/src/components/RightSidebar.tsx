import Image from "next/image";

const friends = [
  { name: "Steve Jobs", role: "CEO of Apple", img: "/images/people1.png", online: false },
  { name: "Ryan Roslansky", role: "CEO of Linkedin", img: "/images/people2.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/images/people3.png", online: true },
  { name: "Steve Jobs", role: "CEO of Apple", img: "/images/people1.png", online: false },
];

export default function RightSidebar() {
  return (
    <div className="mb-4 rounded-[6px] bg-surface pt-6 pr-6 pb-1.5 pl-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-[20px] leading-[1.4] font-medium text-heading">
          Your Friends
        </h4>
        <span className="cursor-pointer text-[12px] leading-[18px] font-medium text-primary">
          See All
        </span>
      </div>

      <form className="relative mb-6">
        <svg
          className="absolute top-[12px] left-[18px] text-muted"
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" />
          <path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" />
        </svg>
        <input
          type="search"
          placeholder="input search"
          className="h-10 w-full rounded-full border border-input bg-input px-[47px] text-[16px] outline-none placeholder:text-black/25 dark:placeholder:text-white/25 hover:border-primary"
        />
      </form>

      <div>
        {friends.map((friend, i) => (
          <div
            key={i}
            className="mb-6 flex items-center justify-between rounded-[8px] p-1.5 hover:bg-[#e4e6e9] dark:hover:bg-[#3a3b3d]"
          >
            <div className="flex items-center">
              <span className="mr-4 block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={friend.img}
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </span>
              <div>
                <h4 className="text-[14px] leading-[1.4] font-medium whitespace-nowrap text-heading">
                  {friend.name}
                </h4>
                <p className="text-[11px] leading-[1.4] font-light text-heading">
                  {friend.role}
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-2">
              {friend.online ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="var(--color-surface)"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              ) : (
                <span className="text-[11px] leading-[21px] whitespace-nowrap text-muted">
                  5 minute ago
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
