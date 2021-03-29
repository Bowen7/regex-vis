type Option = {
  label: string
  value: string
}

const fromRecommendedOptions: Option[] = [
  { label: "a", value: "a" },
  { label: "A", value: "A" },
  { label: "0", value: "0" },
  { label: "1", value: "1" },
]

const toRecommendedOptions: Option[] = [
  { label: "z", value: "z" },
  { label: "Z", value: "Z" },
  { label: "9", value: "9" },
]

export { fromRecommendedOptions, toRecommendedOptions }
