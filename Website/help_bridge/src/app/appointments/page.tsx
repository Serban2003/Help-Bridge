"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/models/AuthContext";
import Calendar from "@/app/components/Calendar";
import {
  fetchAvailabilityByHelperId,
  fetchAppointmentsByHelperId,
  fetchAppointmentsByUserId,
  addHelperAvailability,
  deleteHelperAvailability,
} from "@/app/utils";
import { Availability } from "@/app/models/Availability";
import { Appointment } from "@/app/models/Appointment";
import HelperAvailabilityCalendar from "@/app/components/HelperAvailabilityCalendar";

export default function AppointmentsPage() {
  const { auth } = useAuth();
  const [availability, setAvailability] = useState<Availability[] | null>([]);
  const [appointments, setAppointments] = useState<Appointment[] | null>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const loadData = async () => {
      try {
        if (auth.role === "helper") {
          const slots = await fetchAvailabilityByHelperId(auth.id);
          const booked = await fetchAppointmentsByHelperId(auth.id);
          console.log("Fetched slots:", slots);
          setAvailability(slots);
          setAppointments(booked);
        } else if (auth.role === "user") {
          const booked = await fetchAppointmentsByUserId(auth.id);
          setAppointments(booked);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth]);

const handleSetAvailability = async (date : string, toAdd : string[], toDelete: number[]) => {
  try {
    if (!auth) {
      return { success: false, error: "Not authenticated." };
    }

    if (toAdd.length > 0) {
      await addHelperAvailability(auth.id, date, toAdd); // POST new slots
    }

    if (toDelete.length > 0) {
      await deleteHelperAvailability(toDelete); // DELETE slots by AV_id
    }

    const updated = await fetchAvailabilityByHelperId(auth.id);
    setAvailability(updated);

    return { success: true };
  } catch (err) {
    console.error("Failed to update availability:", err);
    return { success: false, error: "Failed to update availability." };
  }
};



  return (
    <div className="container py-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>

          {auth && auth.role === "helper" && (
  <>
    <h2 className="mt-4">Set Your Availability</h2>
    <HelperAvailabilityCalendar
  onSubmitAvailability={handleSetAvailability}
  existingAvailability={availability}
/>

  </>
)}

          <h2 className="mt-4">Appointments by Day</h2>
          {!appointments || appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            appointments.map((appt) => {
              const utcDate = new Date(appt.Date);
              const dateStr = utcDate.toISOString().split("T")[0];
              const timeStr = utcDate.toISOString().split("T")[1].substring(0, 5); // hh:mm

              return (
                <div key={appt.A_id} className="border rounded p-2 mb-2">
                  <strong>{dateStr}</strong> — {timeStr} UTC <br />
                  <span>{appt.Title}</span> <br />
                  <span>{appt.Message}</span>
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
