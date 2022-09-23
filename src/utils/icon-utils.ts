export const solid = "fa-solid";
export const regular = "fa-regular";

export const getSolid = (state?: boolean): string => {
  return state ? solid : regular;
};
