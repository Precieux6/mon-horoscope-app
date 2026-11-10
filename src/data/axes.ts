export type Axis = 'relations' | 'carriere' | 'argent' | 'sante' | 'sens';
export const AXES: Axis[] = ['relations', 'carriere', 'argent', 'sante', 'sens'];
export const AXIS_LABEL: Record<Axis, string> = {
  relations: 'Relations & amour',
  carriere: 'Carrière & action',
  argent: 'Argent & ressources',
  sante: 'Santé & énergie',
  sens: 'Sens & spiritualité',
};
export type AxisVector = Partial<Record<Axis, number>>;
