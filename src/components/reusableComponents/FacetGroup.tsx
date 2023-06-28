import { Box, Checkbox, createStyles, Text } from '@mantine/core'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const useStyles = createStyles(() => ({
  facetCheckboxLabelWrapper: {
    width: '100%',
  },
}))

type TInput = {
  values: string[]
  header: string
  onChange: (value: string[]) => void
  facets: {
    name: string
    displayedName?: string
    count: number
  }[]
  disabled: boolean
}

const FacetGroup: FC<TInput> = ({
  values,
  header,
  facets,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <>
      <Text mt={10} mb={5} fz="sm" fw={700}>
        {header}
      </Text>
      <Checkbox.Group value={values} onChange={(value) => onChange(value)}>
        {facets.map((f) => (
          <Checkbox
            key={f.name}
            value={f.name}
            disabled={disabled}
            sx={(theme) => ({
              marginTop: theme.spacing.xs,
              marginBottom: theme.spacing.xs,
              cursor: 'pointer',
              width: '100%',
            })}
            classNames={{
              labelWrapper: classes.facetCheckboxLabelWrapper,
            }}
            label={
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  fontSize: theme.fontSizes.xs,
                })}
              >
                <span>
                  {f.name.length > 0
                    ? f.displayedName || f.name
                    : t('facet_states.empty')}
                </span>
                <span>{f.count}</span>
              </Box>
            }
          />
        ))}
      </Checkbox.Group>
    </>
  )
}

export default FacetGroup
