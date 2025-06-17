import Image from "next/image";
import ThemeSelector from "@/components/ThemeSelector";

export default function Home() {
  const currentDate = new Date();

  // Format date as "Thu, May 29, 2025"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time as "12:38 PM"
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
      <nav className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Image src="/daystar_logo.png" alt="Logo" width={120} height={160} />
        </div>

        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end">
          <div className="flex items-end flex-row gap-2 font-bold gap-2">
            <div className="text-sm md:text-medium text-accent">
              {formattedDate}, {formattedTime}
            </div>
            <div className="text-md md:text-medium text-secondary">
              Web Users : {8}
            </div>
          </div>
        </div>
      </nav>

      <h1 className="font-bold text-xl md:text-4xl text-primary my-8 text-center">
        St. Louis - Now St. Louis Tornado $100K : 05/19/25 - 25215010
      </h1>

      <section className="">
        <div className="flex flex-wrap items-center justify-around md:justify-center md:gap-8 my-2 md:my-4">
          <div className="font-bold text-2xl md:text-4xl text-secondary">
            WEB : {`54`}
          </div>
          <div
            className="font-bold radial-progress bg-primary text-primary-content border-primary border-4"
            style={{ "--value": 100 } /* as React.CSSProperties */}
            aria-valuenow={100}
            role="progressbar"
          >
            100%
          </div>
          <div className="font-bold text-4xl md:text-4xl text-secondary">
            ${`11,702.70`}
          </div>
        </div>
      </section>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <section className="w-full">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            2025 Fundraiser
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              {/* head */}
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th>APPEAL</th>
                  <th>US</th>
                  <th>CA</th>
                  <th>INTL</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr className="bg-base-200">
                  <th>$0 - $0.01</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>$0.02 - $1,000</th>
                  <td>50</td>
                  <td>2</td>
                  <td>0</td>
                  <td>52</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>$1000 - $50,000</th>
                  <td>2</td>
                  <td>0</td>
                  <td>0</td>
                  <td>2</td>
                </tr>
                <tr className="text-xs md:text-2xl bg-base-200">
                  <th>TOTAL</th>
                  <td>52</td>
                  <td>2</td>
                  <td>0</td>
                  <td>54</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
        <section className="w-full md:w-1/2">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            2025 Fundraiser Sources
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              {/* head */}
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th>USD</th>
                  <th>TOTAL</th>
                  <th>US</th>
                  <th>CA & INTL</th>
                  <th>WEB</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr className="bg-base-200">
                  <th>One Time Gift</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>Recurring Received</th>
                  <td>50</td>
                  <td>2</td>
                  <td>0</td>
                  <td>52</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>Recurring Potential</th>
                  <td>2</td>
                  <td>0</td>
                  <td>0</td>
                  <td>2</td>
                </tr>
                <tr>
                  <th>Monthly Pledged</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th>One Time Pledged</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="w-full md:w-1/2">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            2025 Fundraiser (Mini) - Campaign Tools
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-mx md:text-xl">
              {/* head */}

              <thead>
                <tr />
                <tr className="text-xs md:text-2xl">
                  <th />
                  <th>PLEDGES</th>
                  <th>PERCENTAGE</th>
                  <th>DOLLARS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-base-200">
                  <th>LIVE</th>
                  <td>1,282</td>
                  <td>78</td>
                  <td>$217,356</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>WEB</th>
                  <td>352</td>
                  <td>22</td>
                  <td>$62,647</td>
                </tr>

                <tr className="text-xs md:text-2xl bg-base-200">
                  <th>TOTAL</th>
                  <td>1634</td>
                  <td>100</td>
                  <td>$280,004</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <section className="absolute bottom-4 right-2">
        <ThemeSelector />
      </section>
    </>
  );
}
