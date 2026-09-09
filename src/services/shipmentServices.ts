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
export async function searchShipment(trackingNumber: string) {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .single();

  if (error) {
  return null;
}

return {
  trackingNumber: data.tracking_number,
  sender: data.sender,
  receiver: data.receiver,
  location: data.location,
  status: data.status,
  estimatedDelivery: data.estimated_delivery,
  history: data.history,
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
export async function updateShipment(
  trackingNumber: string,
  shipment: Shipment
) {
  const { error } = await supabase
    .from("shipments")
    .update({
      sender: shipment.sender,
      receiver: shipment.receiver,
      location: shipment.location,
      status: shipment.status,
      estimated_delivery: shipment.estimatedDelivery,
      history: shipment.history,
    })
    .eq("tracking_number", trackingNumber);

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