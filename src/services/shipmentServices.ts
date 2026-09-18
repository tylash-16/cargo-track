import { supabase } from "../lib/supabase";
import type { Shipment } from "../types/shipment";

// Get all shipments
export async function getShipments() {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// Search shipment
// Search shipment
export async function searchShipment(trackingNumber: string) {
  console.log("Searching:", trackingNumber);

  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", trackingNumber.trim())
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const shipment = data[0];

  return {
    trackingNumber: shipment.tracking_number,
    sender: shipment.sender,
    receiver: shipment.receiver,
    location: shipment.location,
    status: shipment.status,
    estimatedDelivery: shipment.estimated_delivery,
    history: shipment.history,
  };
}


// Add shipment
export async function addShipment(shipment: Shipment) {
  const { data, error } = await supabase
    .from("shipments")
    .insert([
      {
        tracking_number: shipment.trackingNumber,
        sender: shipment.sender,
        receiver: shipment.receiver,
        location: shipment.location,
        status: shipment.status,
        estimated_delivery: shipment.estimatedDelivery,
        history: shipment.history,
      },
    ])
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return !error;
}

// Update shipment
// Update shipment
export async function updateShipment(
  trackingNumber: string,
  shipment: Shipment
) {
  // Get current shipment first
  const { data: currentShipment, error: fetchError } = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .limit(1);

  if (fetchError || !currentShipment || currentShipment.length === 0) {
    console.error("Failed to find shipment:", fetchError);
    return false;
  }

  const existing = currentShipment[0];

  // Keep existing history
  const history = Array.isArray(existing.history)
    ? [...existing.history]
    : [];

  // Add new history only when status has changed
  if (existing.status !== shipment.status) {
    const now = new Date();

    history.push({
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: shipment.status,
    });
  }

  const { error } = await supabase
    .from("shipments")
    .update({
      sender: shipment.sender,
      receiver: shipment.receiver,
      location: shipment.location,
      status: shipment.status,
      estimated_delivery: shipment.estimatedDelivery,
      history: history,
    })
    .eq("tracking_number", trackingNumber);

  console.log("UPDATE ERROR:", error);

  return !error;
}
// Delete shipment
export async function deleteShipment(trackingNumber: string) {
  const { error } = await supabase
    .from("shipments")
    .delete()
    .eq("tracking_number", trackingNumber);

  return !error;
}