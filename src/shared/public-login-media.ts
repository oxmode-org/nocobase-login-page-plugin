export const getPublicLoginMediaUrl = (attachmentId?: number) => {
  if (typeof attachmentId !== 'number' || !Number.isInteger(attachmentId) || attachmentId <= 0) {
    return undefined;
  }

  return `/api/loginPageMedia:get/${attachmentId}`;
};
