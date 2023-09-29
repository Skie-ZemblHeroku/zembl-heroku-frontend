import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { FieldValues, useForm } from 'react-hook-form'
import RegistrationContext from '../../contexts/RegistrationContext'
import { useContext } from 'react'
import { Typography } from '@material-tailwind/react'
import { ELECTRICITY_VALUE, GAS_VALUE, RegistrationData } from '../../constants'
import PlanSummaryCard from '../../components/PlanSummaryCard'
import AccountDetailsForm from '../../components/Forms/PersonalDetails/AccountDetailsForm'
import BusinessDetailsForm from '../../components/Forms/PersonalDetails/BusinessDetailsForm'
import PageNavigationActions from '../../components/PageNavigationActions'
import ControllerCheckBox from '../../components/Inputs/ControllerCheckBox'
import { useFetchQuoteDataQuery } from '../../hooks/useQueryPlanData'
import { useToast } from '../../hooks'
import { AccountDetail, ProcessQuoteOutput } from '../../api/quote'
import { useUpdateQuoteMutation } from '../../hooks/useUpdateQuoteMutation'
import { getJSONDateString } from '../../helpers/formatter'

const ReviewPlanPage = () => {
  const navigate = useNavigate()
  const { registrationData, registrationToken, setRegistrationData } = useContext(RegistrationContext)

  // On load page get data from context
  const { handleSubmit, control, setValue, watch, getValues, trigger, formState } = useForm({
    mode: 'all',
    defaultValues: registrationData as FieldValues,
  })
  const { fireAlert } = useToast()

  const businessDetails: unknown = watch('businessDetails')

  const getPlanData = useFetchQuoteDataQuery(
    { quoteToken: registrationData?.quoteToken as string, token: registrationToken ?? '' },
    {
      onSuccess: (data: ProcessQuoteOutput) => {
        setRegistrationData((prev) => ({ ...prev, ...(data as Partial<RegistrationData>) }))
        setValue('businessDetails', data.businessDetails)
        setValue('accountDetails', data.accountDetails)
      },
      onError: () => {
        fireAlert({ children: 'Unfortunately, we cannot find your quote.', type: 'error' })
        // navigate('/')
      },
    },
  )

  const updatePlanData = useUpdateQuoteMutation({
    onSuccess: (_, data) => {
      console.log(data)
      setRegistrationData((prev) => ({ ...prev, ...data.planData }))
    },
    onError: () => {
      fireAlert({ children: 'Unfortunately, we cannot find your quote.', type: 'error' })
    },
  })

  const onFormSaved = () => {
    let updatedAccount = getValues('accountDetails') as AccountDetail

    if (formState.errors?.accountDetails)
      return trigger(
        [
          'accountDetails.title',
          'accountDetails.firstName',
          'accountDetails.lastName',
          'accountDetails.dateOfBirth',
          'accountDetails.email',
          'accountDetails.phone',
          'accountDetails.altPhone',
        ],
        { shouldFocus: true },
      )

    if (updatedAccount) {
      updatedAccount = {
        ...registrationData?.accountDetails,
        ...updatedAccount,
        dateOfBirth: getJSONDateString(updatedAccount.dateOfBirth),
      }
      const updatedPlanData = { ...registrationData, accountDetails: updatedAccount }
      updatePlanData.mutate({ planData: updatedPlanData, token: registrationToken ?? '' })
    }
  }

  const onSubmit = (data: FieldValues) => {
    console.log(data)
    try {
      setRegistrationData((prev) => ({ ...prev, ...data }))
      // await updatePlanData.mutateAsync({
      //   planData: {
      //     ...data,
      //     accountDetails: {
      //       ...data.accountDetails,
      //       dateOfBirth: getJSONDateString(data.dateOfBirth as Date),
      //     } as AccountDetail,
      //   },
      //   token: registrationToken ?? '',
      // })
      navigate('/preferences')
    } catch (error) {
      console.log(error)
    }
  }

  const electricityPlanSummary = registrationData?.electricityQuote ? (
    <PlanSummaryCard
      planId={registrationData?.electricityQuote.quoteId ?? ''}
      planType={ELECTRICITY_VALUE}
      planBrand={registrationData?.electricityQuote.productName ?? ''}
      planLogoURL="/vite.svg"
      planBenefits={['No Exit Fees', '100% Australian Owned']}
      planDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend sagittis tortor nec fermentum. Pellentesque id nulla vel dui pretium aliquam. Fusce auctor varius orci, eu rhoncus lorem. Suspendisse sollicitudin metus sed est vulputate, vitae commodo elit dapibus. Vivamus eleifend neque quam. Duis vel condimentum orci. Maecenas quis aliquet turpis. Proin feugiat magna mi, nec pharetra eros imperdiet sed. Ut eleifend dictum quam ac auctor. Morbi convallis tempus arcu, ac rutrum ligula."
      planEstAnnualSaving={registrationData?.electricityQuote?.annualSavingIncGST ?? NaN}
      planLessThanCurrentPricePercent={0.25}
      planEstCostPerMonth={500}
      planEstCostPerYear={469}
      fullAddress={registrationData?.electricityQuote?.address ?? ''}
      gasOrEnergyCode={registrationData?.electricityQuote?.nmi ?? ''}
    />
  ) : null

  const gasPlanSummary = registrationData?.gasQuote ? (
    <PlanSummaryCard
      planId={registrationData?.gasQuote.quoteId ?? ''}
      planType={GAS_VALUE}
      planBrand={registrationData?.gasQuote.productName ?? ''}
      planLogoURL="/vite.svg"
      planBenefits={['No Exit Fees', '100% Australian Owned']}
      planDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend sagittis tortor nec fermentum. Pellentesque id nulla vel dui pretium aliquam. Fusce auctor varius orci, eu rhoncus lorem. Suspendisse sollicitudin metus sed est vulputate, vitae commodo elit dapibus. Vivamus eleifend neque quam. Duis vel condimentum orci. Maecenas quis aliquet turpis. Proin feugiat magna mi, nec pharetra eros imperdiet sed. Ut eleifend dictum quam ac auctor. Morbi convallis tempus arcu, ac rutrum ligula."
      planEstAnnualSaving={registrationData?.gasQuote?.annualSavingIncGST ?? NaN}
      planLessThanCurrentPricePercent={0.25}
      planEstCostPerMonth={500}
      planEstCostPerYear={469}
      fullAddress={registrationData?.gasQuote?.address ?? ''}
      gasOrEnergyCode={registrationData?.gasQuote?.mirn ?? ''}
    />
  ) : null

  return (
    <PageWrapper showLoading={getPlanData.isLoading || updatePlanData.isLoading}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full md:w-10/12 items-center">
        <Typography variant="h1" className="text-center text-zembl-p text-3xl lg:text-5xl">
          Energy Plan Confirmation
        </Typography>
        <Typography className="text-center text-base font-normal text-zembl-p">
          Please check your plans and contact details are correct
        </Typography>
        {electricityPlanSummary}
        {gasPlanSummary}
        <AccountDetailsForm
          control={control}
          readOnly
          prefix="accountDetails"
          onSave={onFormSaved}
          saveDisabled={!!formState.errors?.accountDetails}
        />
        {businessDetails ? (
          <BusinessDetailsForm control={control} readOnly compactForm prefix="businessDetails" />
        ) : null}
        <ControllerCheckBox
          label="I have checked this is my correct personal and or business information"
          control={control}
          name="confirm"
          required
        />
        <PageNavigationActions nextLabel="Continue" hidePrev containerClass="w-full" />
      </form>
    </PageWrapper>
  )
}

export default ReviewPlanPage
