export type Mail = {
  author: string;
  content: string;
  read?: boolean;
  star?: boolean;
  important?: boolean;
  spam?: boolean;
  deleted?: boolean;
  selected?: boolean;
};

const filterInbox = (mail: Mail): boolean => {
  return !mail.deleted && !mail.spam;
};
const filterStar = (mail: Mail): boolean => {
  return (!mail.deleted && mail.star) as boolean;
};
const filterImportant = (mail: Mail): boolean => {
  return (!mail.deleted && mail.important) as boolean;
};
const filterSpam = (mail: Mail): boolean => {
  return (!mail.deleted && mail.spam) as boolean;
};
const filterDeleted = (mail: Mail): boolean => {
  return mail.deleted as boolean;
};
export const filters = [
  filterInbox,
  filterStar,
  filterImportant,
  filterSpam,
  filterDeleted,
] as const;

const countInbox = (mails: Mail[]): number => {
  let count = 0;
  for (const mail of mails) if (filterInbox(mail)) count++;
  return count;
};
const countStar = (mails: Mail[]): number => {
  let count = 0;
  for (const mail of mails) if (filterStar(mail)) count++;
  return count;
};
const countImportant = (mails: Mail[]): number => {
  let count = 0;
  for (const mail of mails) if (filterImportant(mail)) count++;
  return count;
};
const countSpam = (mails: Mail[]): number => {
  let count = 0;
  for (const mail of mails) if (filterSpam(mail)) count++;
  return count;
};
const countDeleted = (mails: Mail[]): number => {
  let count = 0;
  for (const mail of mails) if (filterDeleted(mail)) count++;
  return count;
};
export const counts = [
  countInbox,
  countStar,
  countImportant,
  countSpam,
  countDeleted,
] as const;
