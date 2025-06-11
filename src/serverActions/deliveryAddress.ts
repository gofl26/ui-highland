'use server'
import { authFetch } from '@/lib/authFetch'
import type { deliveryResponse } from '@/types/delivery'

const API_URL = process.env.API_URL || ''

export async function getDelivery(): Promise<deliveryResponse[] | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/deliveryAddress/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [] },
    }: { data: { rows: deliveryResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface CreateDeliveryAddressBody {
  deliveryName: string
  deliveryRecipient: string
  deliveryPhoneNumber: string
  deliveryAddress: string
  deliveryDetailAddress: string
  deliveryDefault: boolean
}

export async function createDelivery(
  body: CreateDeliveryAddressBody,
): Promise<deliveryResponse[] | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/deliveryAddress/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: deliveryResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface UpdateDeliveryBody {
  id: string
  deliveryName: string
  deliveryRecipient: string
  deliveryPhoneNumber: string
  deliveryAddress: string
  deliveryDetailAddress: string
  deliveryDefault: boolean
}
export async function updateDelivery(body: UpdateDeliveryBody): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/deliveryAddress/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function deleteDelivery(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/deliveryAddress/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}
