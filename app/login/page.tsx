import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-8">
          netzy-vulns admin
        </h1>
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/admin" })
          }}
        >
          <button
            type="submit"
            className="bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-lg"
          >
            GitHub로 로그인
          </button>
        </form>
      </div>
    </div>
  )
}
