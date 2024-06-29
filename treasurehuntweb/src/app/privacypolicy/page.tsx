import { api } from "~/trpc/server";

export default async function Page() {
  return (
    <>
      <main className="top-12 flex h-[100svh] w-[100%] justify-center">
        <section className="box-border flex h-[calc(100%-3rem)] max-w-2xl flex-col gap-4 pb-12 text-foreground">
          <h1 className="pb-4 text-3xl font-bold">Privacy Policy</h1>
          <article className="pb-4 text-lg italic">
            This Privacy Policy explains how your personal information is
            collected and used when you visit the Treasure Hunt website or use
            the app.
          </article>
          <article className="text-md">
            Privacy laws give certain rights to individuals over their personal
            data. You have the right to contact us (
            <a href="mailto:jonathan.atger@gmail.com">
              <u>jonathan.atger@gmail.com</u>
            </a>
            ) if you have any questions about our privacy practices, want to
            have a copy of your personal data, or want to correct or delete your
            personal data.
          </article>
          <article className="text-lg italic">
            Personal data we collect about you
          </article>
          <article className="text-md">
            We may collect the following personal data about you:
            <div className="list-disc pl-4">
              <li key="1">Your email address</li>
              <li key="2">Your name</li>
              <li key="3">Your password</li>
              <li key="4">
                A link to your profile pic if you authenticate with a third
                party provider
              </li>
            </div>
          </article>
          <article className="text-md">
            Through your use of the website or the app, we will keep track of :
            <div className="list-disc pl-4">
              <li key="1">The tracks you create</li>
              <li key="2">
                The races you launch or participate in, as well as their results
              </li>
            </div>
          </article>
          <article className="text-lg italic">Our purpose for the data</article>
          <article className="text-md">
            We use your data for the sole puropose of providing and improving
            our services. The data is not shared with any third parties.
          </article>
          <article className="text-md">
            We will keep your data for as long as possible, but cannot be held
            responsible for any loss or damage that may occur as a result of the
            loss of your data. On an account delete, unless you ask for it, we
            will delete your personal data except your name, to keep the history
            of your races.
          </article>
          <article className="text-lg italic">Security</article>
          <article className="text-md">
            We're committed to protecting our users' personal data. We put in
            place appropriate technical and organizational measures to help
            protect the security of your personal data. However, be aware that
            no system is ever completely secure. We have put various safeguards
            in place to guard against unauthorized access and unnecessary
            retention of personal data in our systems. This includes privately
            authorising the actions every user can take on the website, and
            ensuring personal data is not stored or accessed on client devices.
          </article>
          <article className="text-md">
            To protect your user account, we encourage you to:
            <div className="list-disc pb-4 pl-4" key="5">
              <li key="1">Use a strong password</li>
              <li key="2">Never share your password with anyone</li>
              <li key="3">Limit access to your browser or unlocked phone</li>
              <li key="4">Log out once you're done</li>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
