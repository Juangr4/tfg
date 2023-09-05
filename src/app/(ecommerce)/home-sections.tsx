import Link from "next/link";

// https://merakiui.gumroad.com/l/hero-header?layout=profile
export const MainSection = () => {
  return (
    <section>
      <div className="relative grid w-full bg-indigo-500 h-96 lg:h-[32rem] place-items-center">
        <div className="flex flex-col items-center mx-auto text-center">
          <h1 className="text-4xl font-semibold text-white uppercase md:text-6xl">
            Main Content
          </h1>

          <p className="mt-6 text-lg leading-5 text-white">The best in town.</p>

          <a href="#about" className="mt-8 cursor-pointer animate-bounce">
            <svg
              width="53"
              height="53"
              viewBox="0 0 53 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="27" cy="26" r="18" stroke="white" strokeWidth="2" />
              <path
                d="M22.41 23.2875L27 27.8675L31.59 23.2875L33 24.6975L27 30.6975L21 24.6975L22.41 23.2875Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </div>

      <svg
        className="fill-indigo-500"
        viewBox="0 0 1440 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1440 0H0V57C720 0 1440 57 1440 57V0Z" />
      </svg>
    </section>
  );
};

export const AboutSection = () => {
  return (
    <section className="container px-6 py-8 mx-auto lg:py-16 " id="about">
      <div className="lg:flex lg:items-center lg:-mx-4">
        <div className="lg:w-1/2 lg:px-4">
          <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
            We create awesome prototypes, plugins, and templates.
          </h3>

          <p className="mt-6 text-gray-500 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
            laboriosam provident voluptatum id magni iste nobis corrupti,
            delectus quis repellat, debitis error quod explicabo molestiae rerum
            totam ab sunt excepturi?
          </p>

          <Link
            href={"/products"}
            className="flex items-center mt-8 -mx-2 text-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 mx-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mx-1 font-semibold">See products</p>
          </Link>
        </div>

        <div className="mt-8 lg:w-1/2 lg:px-4 lg:mt-0">
          <img
            className="object-cover w-full rounded-xl h-96"
            src="https://images.unsplash.com/photo-1516131206008-dd041a9764fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
            alt="Video thumbnail"
          />
        </div>
      </div>
    </section>
  );
};

export const AdvantagesSection = () => {
  return (
    <section className="container px-6 py-8 mx-auto lg:py-16">
      <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
        <div className="p-8 space-y-3 border-2 border-indigo-400 rounded-xl">
          <span className="inline-block text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
          </span>

          <h1 className="text-2xl font-semibold text-gray-700 capitalize">
            web design
          </h1>

          <p className="text-gray-500">
            Research, user experience testing, mockups, and prototypes
          </p>
        </div>

        <div className="p-8 space-y-3 border-2 border-indigo-400 rounded-xl">
          <span className="inline-block text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
          </span>

          <h1 className="text-2xl font-semibold text-gray-700 capitalize">
            development
          </h1>

          <p className="text-gray-500">
            Research, user experience testing, mockups, and prototypes
          </p>
        </div>

        <div className="p-8 space-y-3 border-2 border-indigo-400 rounded-xl">
          <span className="inline-block text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </span>

          <h1 className="text-2xl font-semibold text-gray-700 capitalize">
            research
          </h1>

          <p className="text-gray-500">
            Research, user experience testing, mockups, and prototypes
          </p>
        </div>
      </div>
    </section>
  );
};
