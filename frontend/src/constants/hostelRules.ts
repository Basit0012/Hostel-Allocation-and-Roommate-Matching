/**
 * Shared residential appliance and hostel compliance rules.
 *
 * Notice: No backend policy table currently exposes these rules from the API.
 * Status is strictly unverified until confirmed with the hostel warden and DSA.
 */

export interface ProhibitedItemRule {
  id: string;
  label: string;
  reason: string;
}

export const HOSTEL_POLICY_STATUS = 'unverified, confirm with warden/DSA' as const;

export const PROHIBITED_APPLIANCES: readonly ProhibitedItemRule[] = [
  {
    id: 'immersion-rod',
    label: 'Immersion heating rods',
    reason: 'High thermal draw and fire hazard inside hostel rooms.',
  },
  {
    id: 'induction-cooktop',
    label: 'Induction cooktops',
    reason: 'Unauthorized cooking equipment on residential room circuits.',
  },
  {
    id: 'space-heater',
    label: 'Space heaters',
    reason: 'Exceeds standard room socket circuit capacity.',
  },
  {
    id: 'electric-iron',
    label: 'Electric irons',
    reason: 'Prohibited high-wattage heating appliance.',
  },
] as const;

export const PROHIBITED_POLICY_NOTE =
  'Permitted-appliance exceptions are not listed until confirmed with the hostel warden and Division of Student Affairs (DSA).';

