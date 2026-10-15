import { useState } from "react";

const clinicDetails = {
  name: "AL SHIFA",
  subtitle: "HOMEO CLINIC",
  doctors: ["Dr. M Sharif", "Dr. Farha Nishat"],
  address: "Azizul Complex, Kolasi, Katihar, Bihar",
  timings: "10:00 AM – 7:00 PM",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-clinic-cream text-clinic-dark">
      {/* Announcement bar */}
      <div className="bg-clinic-dark px-4 py-2 text-center text-sm text-white">
        Compassionate Care for Your Family
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-green-900/10 bg-clinic-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="flex items-center gap-3" onClick={closeMenu}>
            <img
              src="/clinic-logo.jpeg"
              alt="Al-Shifa Homeo Clinic Logo"
              className="h-16 w-auto object-contain"
            />

            <div>
              <h1 className="text-xl font-bold tracking-wide text-clinic-green">
                {clinicDetails.name}
              </h1>
              <p className="text-xs tracking-[0.25em]">
                {clinicDetails.subtitle}
              </p>
            </div>
          </a>

          <button
            type="button"
            className="text-2xl text-clinic-green md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav
            className={`${
              menuOpen ? "flex" : "hidden"
            } absolute left-0 right-0 top-full flex-col gap-5 border-b bg-clinic-cream p-6 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}
          >
            <a href="#home" onClick={closeMenu} className="hover:text-clinic-gold">
              Home
            </a>
            <a href="#about" onClick={closeMenu} className="hover:text-clinic-gold">
              About
            </a>
            <a href="#doctors" onClick={closeMenu} className="hover:text-clinic-gold">
              Our Doctors
            </a>
            <a href="#contact" onClick={closeMenu} className="hover:text-clinic-gold">
              Contact
            </a>

            <a
              href="#appointment"
              onClick={closeMenu}
              className="rounded-full bg-clinic-green px-6 py-3 text-center font-medium text-white transition hover:bg-clinic-dark"
            >
              Book Appointment
            </a>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <main>
        <section
          id="home"
          className="relative overflow-hidden bg-clinic-green text-white"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28 lg:px-8">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-clinic-gold">
                Your Health, Our Priority
              </p>

              <h2 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
                A Healthier Life Begins With{" "}
                <span className="text-clinic-gold">Compassionate Care.</span>
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-white/80">
                Welcome to Al Shifa Homeo Clinic. Our focus is on listening to
                your concerns and providing attentive, personalized care for
                you and your family.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#appointment"
                  className="rounded-full bg-clinic-gold px-7 py-4 font-semibold text-clinic-dark transition hover:bg-white"
                >
                  Book an Appointment →
                </a>

                <a
                  href="#about"
                  className="rounded-full border border-white/40 px-7 py-4 transition hover:bg-white/10"
                >
                  Discover Our Clinic
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-7 text-sm text-white/80">
                <span>✦ Personalized Attention</span>
                <span>✦ Family-focused Care</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-t-full rounded-b-[12rem] border border-clinic-gold/40 bg-white/5 p-5">
                <div className="flex min-h-[390px] flex-col items-center justify-center rounded-t-full rounded-b-[11rem] bg-clinic-cream px-6 py-12 text-center text-clinic-green">
                  <img
                    src="/clinic-logo.jpeg"
                    alt="Al-Shifa Homeo Clinic Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-sm uppercase tracking-[0.25em]">
                    Welcome to
                  </p>

                  <h3 className="mt-3 text-3xl font-semibold">
                    Al Shifa
                  </h3>

                  <p className="mt-2 tracking-[0.2em]">
                    HOMEO CLINIC
                  </p>

                  <div className="my-6 h-px w-20 bg-clinic-gold" />

                  <p className="max-w-xs text-sm leading-6 text-clinic-dark/70">
                    Care that begins with understanding and respect.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white px-5 py-4 text-clinic-dark shadow-xl sm:-left-8">
                <p className="text-xs text-gray-500">Clinic Hours</p>
                <p className="mt-1 font-semibold">{clinicDetails.timings}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Clinic information */}
        <section className="border-b border-green-900/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 md:grid-cols-3 lg:px-8">
            <div>
              <p className="text-sm text-gray-500">Visit Our Clinic</p>
              <p className="mt-2 font-semibold">📍 {clinicDetails.address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Opening Hours</p>
              <p className="mt-2 font-semibold">◷ {clinicDetails.timings}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Our Doctors</p>
              <p className="mt-2 font-semibold">
                {clinicDetails.doctors.join(" & ")}
              </p>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-24 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-clinic-green">
              About Al Shifa
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Care With Understanding
            </h2>

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-clinic-gold" />

            <p className="mt-8 text-lg leading-8 text-gray-600">
              At Al Shifa Homeo Clinic, we believe that every patient deserves
              time, attention, and respect. Our clinic welcomes individuals
              and families seeking a thoughtful and comfortable healthcare
              experience.
            </p>
          </div>
        </section>

        {/* Doctors */}
        <section id="doctors" className="scroll-mt-24 bg-white px-5 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-clinic-green">
                Meet Our Team
              </p>

              <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
                Our Doctors
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                Meet the doctors at Al Shifa Homeo Clinic, dedicated to
                providing attentive and respectful patient care.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2">
              {clinicDetails.doctors.map((doctor) => (
                <article
                  key={doctor}
                  className="rounded-3xl border border-green-900/10 bg-clinic-cream p-8 text-center transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-clinic-green text-4xl text-white">
                    <img
                      src={
                        doctor === "Dr. M Sharif"
                          ? "/MdSharif.png"
                          : "/Farha.webp"
                      }
                      alt={doctor}
                      className="mx-auto h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">{doctor}</h3>

                  <p className="mt-2 text-sm text-gray-600">
                    Homeopathic Doctor
                  </p>

                  <div className="mx-auto mt-5 h-px w-12 bg-clinic-gold" />

                  <p className="mt-5 text-sm leading-6 text-gray-600">
                    Committed to listening to patients and providing
                    personalized attention.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Appointment */}
        <section
          id="appointment"
          className="scroll-mt-24 bg-clinic-green px-5 py-20 text-white md:py-24"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-clinic-gold">
              We Are Here to Help
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Plan Your Visit
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/80">
              Contact Al Shifa Homeo Clinic to enquire about an appointment
              with our doctors.
            </p>

            <div className="mt-8">
              <a
                href="#contact"
                className="inline-block rounded-full bg-clinic-gold px-8 py-4 font-semibold text-clinic-dark transition hover:bg-white"
              >
                Contact the Clinic →
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 px-5 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-clinic-green">
                Get in Touch
              </p>

              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                Visit Al Shifa Homeo Clinic
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                We welcome your enquiries. Contact the clinic for directions,
                timings, and appointment information.
              </p>
            </div>

            <div className="space-y-6 rounded-3xl border border-green-900/10 bg-white p-8 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="mt-2 font-medium">{clinicDetails.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Opening Hours</p>
                <p className="mt-2 font-medium">{clinicDetails.timings}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Doctors</p>
                <p className="mt-2 font-medium">
                  {clinicDetails.doctors.join(" & ")}
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Azizul+Complex+Kolasi+Katihar+Bihar"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-clinic-green px-6 py-3 font-medium text-white transition hover:bg-clinic-dark"
              >
                Find Us on Google Maps →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-clinic-dark px-5 py-8 text-center text-white/70">
        <p className="font-semibold tracking-wider text-white">
          AL SHIFA HOMEO CLINIC
        </p>

        <p className="mt-2 text-sm">
          {clinicDetails.address}
        </p>

        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} Al Shifa Homeo Clinic. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;