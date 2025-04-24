import { useEffect } from 'react'
import {
  apiGetTournamentById,
  apiGetTournaments,
} from '../services/tournament.service'

export default function V2PanelPage() {
  useEffect(() => {
    apiGetTournaments().then((result) => console.log(result))
    apiGetTournamentById('62e7d07d-f59f-421d-a000-2e4d28ab89db').then(
      (result) => console.log(result)
    )
  }, [])

  return (
    <>
      <section className="container mx-6 my-4">
        <h2 className="text-2xl">直播中</h2>
      </section>

      <section className="container mx-6 my-4">
        <h2 className="text-2xl">近期賽事</h2>

        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  )
}
