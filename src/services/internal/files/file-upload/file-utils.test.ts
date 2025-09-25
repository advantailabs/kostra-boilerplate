import { PREFIX_TO_PURPOSE, inferUploadPurposeFromKey } from './file-utils';

describe('inferUploadPurposeFromKey', () => {
  it('returns the correct purpose for all configured prefixes', () => {
    for (const { prefix, purpose } of PREFIX_TO_PURPOSE) {
      const key = `${prefix}some-folder/some-file.pdf`;
      expect(inferUploadPurposeFromKey(key)).toBe(purpose);
    }
  });

  it('returns undefined when no prefix matches', () => {
    expect(inferUploadPurposeFromKey('unknown/prefix/file.txt')).toBeUndefined();
  });
});
