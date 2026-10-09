export const SAMPLE_SCAN_CLASSES = ["CNV", "DME", "DRUSEN", "NORMAL"] as const;
export type SampleScanClass = (typeof SAMPLE_SCAN_CLASSES)[number];

const COUNT_PER_CLASS = 12;

export const SAMPLE_SCANS: Record<SampleScanClass, string[]> = Object.fromEntries(
  SAMPLE_SCAN_CLASSES.map((c) => [
    c,
    Array.from(
      { length: COUNT_PER_CLASS },
      (_, i) => `/sample-scans/${c.toLowerCase()}-${i + 1}.jpeg`
    ),
  ])
) as Record<SampleScanClass, string[]>;
