export default function PageConnection() {
  return (
    <main className="flex h-full w-[100vw] flex-col items-center justify-center">
      <div>
        <form className="flex flex-col items-center justify-between pb-4 text-black">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className={`mb-3 text-2xl`}>Please log in to continue.</h1>
            <div className="w-full pb-8">
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-slate-200 p-2 text-black"
            >
              Connection
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-6 text-2xl text-black">
          <div>Sign in with Google</div>
          <div>Sign in with Apple</div>
        </div>
      </div>
    </main>
  );
}
