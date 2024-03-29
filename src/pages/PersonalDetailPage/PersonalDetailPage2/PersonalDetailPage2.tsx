import { useForm } from 'react-hook-form'

import { useNavigate } from 'react-router-dom'
import PageNavigationActions from '../../../components/PageNavigationActions'
import AGLPersonalDetailsForm from '../../../components/Forms/RetailerAdditionalDetails/AGLPersonalDetailsForm'
import { useRegistration } from '../../../hooks/useRegistration'
// import { REGISTRATION_TYPE_RESIDENTIAL } from '../../../constants'
import {
  AGL,
  BLUE_NRG,
  ENERGY_AU,
  ENERGY_LOCALS,
  MOMENTUM_ENERGY,
  NEXT_BUSINESS_ENERGY,
  NO_VALUE,
  YES_VALUE,
  SIMPLY_ENERGY,
  GAS_VALUE,
  ELECTRICITY_VALUE,
  // REGISTRATION_TYPE_RESIDENTIAL
} from '../../../constants'
import { useRetailerAdditionalDetailsMutation } from '../../../hooks/useRetailerAdditionalDetailsMutation'
import { buildRetailerAdditionalDetailPayload } from '../../../api/profile'
import { lazy, useEffect } from 'react'
import { GoogleMapExtractedComponents } from '../../../helpers/googleMap'

const BlueNRGPersonalDetailsForm = lazy(() => import('../../../components/Forms/RetailerAdditionalDetails/BlueNRGPersonalDetailsForm'))
const EAPersonalDetailsForm = lazy(() => import('../../../components/Forms/RetailerAdditionalDetails/EAPersonalDetailsForm'))
const SEPersonalDetailsForm = lazy(() => import('../../../components/Forms/RetailerAdditionalDetails/SEPersonalDetailsForm'))
const MomentumPersonalDetailsForm = lazy(() => import('../../../components/Forms/RetailerAdditionalDetails/MomentumPersonalDetailsForm'))
const EnergyLocalPersonalDetailsForm = lazy(() => import('../../../components/Forms/RetailerAdditionalDetails/EnergyLocalPersonalDetailsForm'))
const NBEPersonalDetailsForm = lazy(() => import('../../../components/Forms/RetailerAdditionalDetails/NBEPersonalDetailsForm'))
const AccordionCard = lazy(() => import('../../../components/AccordionCard'))
const MiniPlanCard = lazy(() => import('../../../components/MiniPlanCard'))

const PersonalDetailPage2 = () => {
  const { registrationData, registrationToken, setRegistrationData, sendOTPMutation, setUploadText } = useRegistration()
  // On load page get data from context
  const { handleSubmit, control, watch, setValue } = useForm({ mode: 'all' })
  const navigate = useNavigate()

  const retailerAdditionalDetailsMutation = useRetailerAdditionalDetailsMutation(registrationToken ?? '', {
    onSuccess: (_, data) => {
      setUploadText(null)
      setRegistrationData((prev) => ({
        ...prev,
        secondaryContact: data.secondaryContact,
        newConnectionData: data.newConnection,
        concession: data.concession,
      }))
      sendOTPMutation.mutate();
    },
    onError:() => {
      setUploadText(null)
    }
  })

  const [
    concessionCardHolder,
    concessionConsent,
    onlyResidence,
    consessionCardType,
    hasSecondaryContact,
    hasPower,
    powerAware,
    gasConnected,
    hasWorkCompleted,
    electricalRenovationWork,
    accessMethod,
    firstName,
    lastName,
    isAuthorize
  ]: string[] = watch([
    'concession.concessionCardHolder',
    'concession.concessionConsent',
    'concession.onlyStateRebateResidence',
    'concession.concessionCardType',
    'secondaryContact.hasSecondaryContact',
    'newConnection.powerConnected',
    'newConnection.powerAware',
    'gasNewConnection.gasConnected',
    'newConnection.anyWorkCompletedSinceDisconnected',
    'newConnection.electricalRenovationWork',
    'newConnection.accessMethod',
    'secondaryContact.firstName',
    'secondaryContact.lastName',
    'secondaryContact.isAuthorize'
  ]) as string[]

  const onSubmit = (data: Record<string, unknown>) => {
   
    setRegistrationData((prev) => {

      if((!!prev.electricity && !!prev.gas) || !!prev.electricity) {
        return {
          ...prev,
          secondaryContact: data.secondaryContact,
          newConnectionData: data?.newConnection,
          concession: data.concession,
          }
      } else {
        return {
          ...prev,
          secondaryContact: data.secondaryContact,
          gasNewConnectionData: data?.newConnection,
          concession: data.concession,
          }
      }
    })

    if(!!registrationData.electricity && !!registrationData.gas) {
      navigate('/personal-detail-3')

    } else if(registrationData.gas) {
      data.gasNewConnection = data.newConnection || data.gasNewConnection ? {...(data.newConnection as Record<string, unknown>), ...(data.gasNewConnection as Record<string, unknown>)} : null
      data.newConnection = null
      data.electricQuoteId = registrationData?.electricityQuote?.quoteId
      data.gasQuoteId = registrationData?.gasQuote?.quoteId
      data.businessType = registrationData?.registrationType
      data.accountId = registrationData?.accountDetails?.accountId
      data.concession= {
        ...(data.concession as Record<string, unknown>),
        contactId: registrationData?.accountDetails?.contactId
      }
      data.secondaryContact = {
        ...(data.secondaryContact as Record<string, unknown>),
        accountId: registrationData?.accountDetails?.accountId,
        contactId: registrationData?.accountDetails?.contactId,
        businessType: registrationData?.registrationType
      }
   
      setUploadText('Please Wait')
      retailerAdditionalDetailsMutation.mutate(buildRetailerAdditionalDetailPayload(data))

    } else {
      data.electricQuoteId = registrationData?.electricityQuote?.quoteId
      data.gasNewConnection = null
      data.gasQuoteId = registrationData?.gasQuote?.quoteId
      data.businessType = registrationData?.registrationType
      data.accountId = registrationData?.accountDetails?.accountId
      data.concession= {
        ...(data.concession as Record<string, unknown>),
        contactId: registrationData?.accountDetails?.contactId
      }
      data.secondaryContact = {
        ...(data.secondaryContact as Record<string, unknown>),
        accountId: registrationData?.accountDetails?.accountId,
        contactId: registrationData?.accountDetails?.contactId,
        businessType: registrationData?.registrationType
      }

      setUploadText('Please Wait')
      retailerAdditionalDetailsMutation.mutate(buildRetailerAdditionalDetailPayload(data))
    }
    
  }

  const contactName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
  const selectedElecRetailer = registrationData?.electricityQuote?.retailerName ?? null
  const selectedGasRetailer = registrationData?.gasQuote?.retailerName ?? null
  const isElectricTransfer = (selectedElecRetailer !== registrationData?.currentRetailerElectric) || registrationData.newConnection
  const isGasTransfer = (selectedGasRetailer !== registrationData?.currentRetailerGas) || registrationData.newConnection

  const electricPrice = registrationData?.electricityQuote?.feeText ?? null
  const gasPrice = registrationData?.gasQuote?.feeTextGas ?? null

  // registrationData.registrationType = REGISTRATION_TYPE_RESIDENTIAL
  // registrationData.electricity = true
  // registrationData.gas = false
  // registrationData.newConnection = true
  // const connectionDetails = {
  //   state: 'NSW'
  // }
  // registrationData.connectionDetails = connectionDetails

  const electricQuote = registrationData?.electricityQuote
  const gasQuote = registrationData?.gasQuote
  const energyType = registrationData?.energyType
  const electPlanCard =
    energyType !== GAS_VALUE ? (
      <MiniPlanCard
        brandIcon={electricQuote?.retailerLogo ?? ''}
        energyType={ELECTRICITY_VALUE}
        planName={electricQuote?.productName ?? ''}
      />
    ) : null

  const gasPlanCard =
    energyType !== ELECTRICITY_VALUE ? (
      <MiniPlanCard
        brandIcon={gasQuote?.retailerLogo ?? ''}
        energyType={GAS_VALUE}
        planName={gasQuote?.productName ?? ''}
      />
    ) : null

  const isNextPageDisabled = () => {
    let isNextDisabled = false
    if(concessionCardHolder === NO_VALUE) {
      setValue('concession', {})
    }

    if(([selectedElecRetailer].includes(SIMPLY_ENERGY) || [selectedGasRetailer].includes(SIMPLY_ENERGY)) && (onlyResidence === NO_VALUE || concessionConsent === NO_VALUE || (!consessionCardType && concessionConsent === YES_VALUE) || isAuthorize === NO_VALUE)) {
      isNextDisabled = true
    }

    if(([selectedElecRetailer].includes(ENERGY_LOCALS) || [selectedGasRetailer].includes(ENERGY_LOCALS)) && (concessionConsent === NO_VALUE)) {
      isNextDisabled = true
    }

    if(([selectedElecRetailer].includes(MOMENTUM_ENERGY) || [selectedGasRetailer].includes(MOMENTUM_ENERGY)) && (concessionConsent === NO_VALUE)) {
      isNextDisabled = true
    }

    if(([selectedElecRetailer].includes(AGL) || [selectedGasRetailer].includes(AGL)) && (concessionConsent === NO_VALUE)) {
      isNextDisabled = true
    }

    return isNextDisabled
  }

  registrationData.nextPageDisabled = isNextPageDisabled()

  useEffect(() => {
    if (!onlyResidence || onlyResidence === NO_VALUE) {
      setValue('concession.concessionConsent', NO_VALUE)
    }
  }, [setValue, onlyResidence])

  useEffect(() => {
    setValue('secondaryContact', registrationData?.secondaryContact ?? {})
    setValue('concession', registrationData?.concession ?? {})
    setValue('newConnection', registrationData?.newConnectionData ?? null)
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <AccordionCard
        alwaysOpen
        open
        title="Your Energy Plans"
        bodyClassName="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        { (!!registrationData?.electricity && !!registrationData?.gas) || !!registrationData.electricity ? 
          electPlanCard :
          gasPlanCard
        }
      </AccordionCard>

      { (!!registrationData.electricity && !!registrationData.gas) || !!registrationData.electricity ?
        <>
      {[selectedElecRetailer].includes(AGL) ? (
        <AGLPersonalDetailsForm
          control={control}
          electric={!!registrationData?.electricity}
          gas={false}
          connectionPrice={electricPrice} // NO GAS CONNECTION
          isNewConnection={!!registrationData?.newConnection}
          registrationType={registrationData?.registrationType ?? ''}
          state={registrationData?.connectionDetails?.state ?? ''}
          hasPower={hasPower}
          hasWorkCompleted={hasWorkCompleted}
          concessionHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          hasSecondaryContact={hasSecondaryContact}
          secondaryContactName={contactName}
          isTransfer={
            (selectedElecRetailer === AGL && isElectricTransfer) || (selectedGasRetailer === AGL && isGasTransfer)
          }
        />
      ) : null}

      {[selectedElecRetailer].includes(BLUE_NRG) ? (
        <BlueNRGPersonalDetailsForm
          control={control}
          electric={!!registrationData?.electricity}
          connectionPrice={electricPrice} // NO GAS CONNECTION
          isNewConnection={!!registrationData?.newConnection}
          state={registrationData?.connectionDetails?.state ?? ''}
          hasPower={hasPower}
          hasSecondaryContact={hasSecondaryContact}
          connectionDate={registrationData?.moveInDate ? new Date(registrationData?.moveInDate) : null}
        />
      ) : null}

      {[selectedElecRetailer].includes(ENERGY_AU) ? (
        <EAPersonalDetailsForm
          control={control}
          electricityConnectionPrice={electricPrice ?? null}
          // gasConnectionPrice={gasPrice ?? null}
          isNewConnection={!!registrationData?.newConnection}
          state={registrationData?.connectionDetails?.state ?? ''}
          powerAware={powerAware}
          hasSecondaryContact={hasSecondaryContact}
          accessMethod={accessMethod}
        />
      ) : null}

      {[selectedElecRetailer].includes(SIMPLY_ENERGY) ? (
        <SEPersonalDetailsForm
          control={control}
          electric={!!registrationData?.electricity}
          registrationType={registrationData?.registrationType ?? ''}
          state={registrationData?.connectionDetails?.state ?? 'NSW'}
          onlyResidence={onlyResidence}
          siteAddress={
            (registrationData?.fullAddress) ??
            (registrationData?.address as GoogleMapExtractedComponents)?.fullAddress ??
            ''
          }
          isNewConnection={!!registrationData?.newConnection}
          powerAware={powerAware}
          electricityConnectionPrice={electricPrice ?? null}
          // gasConnectionPrice={gasPrice ?? null}
          hasSecondaryContact={hasSecondaryContact}
          secondaryContactName={contactName}
          concessionCardHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          isAuthorize={isAuthorize}
        />
      ) : null}

      {[selectedElecRetailer].includes(MOMENTUM_ENERGY) ? (
        <MomentumPersonalDetailsForm
          control={control}
          registrationType={registrationData?.registrationType ?? ''}
          state={registrationData?.connectionDetails?.state ?? ''}
          isNewConnection={!!registrationData?.newConnection}
          // gasConnected={gasConnected}
          powerAware={powerAware}
          electricityConnectionPrice={electricPrice ?? null}
          // gasConnectionPrice={gasPrice ?? null}
          hasSecondaryContact={hasSecondaryContact}
          concessionCardHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          gas={false}
          electricity={!!registrationData.electricity}
        />
      ) : null}

      {[selectedElecRetailer].includes(ENERGY_LOCALS) ? (
        <EnergyLocalPersonalDetailsForm
          control={control}
          registrationType={registrationData?.registrationType ?? ''}
          isNewConnection={!!registrationData?.newConnection}
          electricalRenovationWork={electricalRenovationWork}
          concessionCardHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          connectionPrice={electricPrice}
        />
      ) : null}

      {[selectedElecRetailer].includes(NEXT_BUSINESS_ENERGY) ? (
        <NBEPersonalDetailsForm
          control={control}
          isNewConnection={!!registrationData?.newConnection}
          hasSecondaryContact={hasSecondaryContact}
          powerAware={powerAware}
          connectionPrice={electricPrice}
        />
      ) : null}
      
      </> : 
      // GAS RETAILER
      <>
      {[selectedGasRetailer].includes(AGL) ? (
        <AGLPersonalDetailsForm
          control={control}
          electric={false}
          gas={!!registrationData?.gas}
          // connectionPrice={electricPrice} // NO GAS CONNECTION
          isNewConnection={!!registrationData?.newConnection}
          registrationType={registrationData?.registrationType ?? ''}
          // state={registrationData?.connectionDetails?.state ?? ''}
          // hasPower={hasPower}
          // hasWorkCompleted={hasWorkCompleted}
          concessionHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          hasSecondaryContact={hasSecondaryContact}
          secondaryContactName={contactName}
          isTransfer={
            (selectedGasRetailer === AGL && isGasTransfer)
          }
        />
      ) : null}

      {[selectedGasRetailer].includes(BLUE_NRG) ? (
        <BlueNRGPersonalDetailsForm
          control={control}
          electric={false}
          isNewConnection={!!registrationData?.newConnection}
          hasSecondaryContact={hasSecondaryContact}
          connectionDate={registrationData?.moveInDate ? new Date(registrationData?.moveInDate) : null}
        />
      ) : null}

      {[selectedGasRetailer].includes(ENERGY_AU) ? (
        <EAPersonalDetailsForm
          control={control}
          electricityConnectionPrice={null}
          gasConnectionPrice={gasPrice ?? null}
          isNewConnection={!!registrationData?.newConnection}
          state={registrationData?.connectionDetails?.state ?? ''}
          powerAware={powerAware}
          hasSecondaryContact={hasSecondaryContact}
          accessMethod={accessMethod}
        />
      ) : null}

      {[selectedGasRetailer].includes(SIMPLY_ENERGY) ? (
        <SEPersonalDetailsForm
          control={control}
          electric={false}
          registrationType={registrationData?.registrationType ?? ''}
          state={registrationData?.connectionDetails?.state ?? 'NSW'}
          onlyResidence={onlyResidence}
          siteAddress={
            (registrationData?.fullAddress) ??
            (registrationData?.address as GoogleMapExtractedComponents)?.fullAddress ??
            ''
          }
          isNewConnection={!!registrationData?.newConnection}
          powerAware={powerAware}
          gasConnectionPrice={gasPrice ?? null}
          hasSecondaryContact={hasSecondaryContact}
          secondaryContactName={contactName}
          concessionCardHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          isAuthorize={isAuthorize}
        />
      ) : null}

      {[selectedGasRetailer].includes(MOMENTUM_ENERGY) ? (
        <MomentumPersonalDetailsForm
          control={control}
          registrationType={registrationData?.registrationType ?? ''}
          state={registrationData?.connectionDetails?.state ?? ''}
          isNewConnection={!!registrationData?.newConnection}
          powerAware={powerAware}
          gasConnected={gasConnected}
          gasConnectionPrice={gasPrice ?? null}
          hasSecondaryContact={hasSecondaryContact}
          concessionCardHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          gas={!!registrationData.gas}
          electricity={!!registrationData.electricity}
        />
      ) : null}

      {[selectedGasRetailer].includes(ENERGY_LOCALS) ? (
        <EnergyLocalPersonalDetailsForm
          control={control}
          registrationType={registrationData?.registrationType ?? ''}
          isNewConnection={!!registrationData?.newConnection}
          electricalRenovationWork={electricalRenovationWork}
          concessionCardHolder={concessionCardHolder}
          concessionConsent={concessionConsent}
          connectionPrice={gasPrice}
        />
      ) : null}

      {[selectedGasRetailer].includes(NEXT_BUSINESS_ENERGY) ? (
        <NBEPersonalDetailsForm
          control={control}
          isNewConnection={!!registrationData?.newConnection}
          hasSecondaryContact={hasSecondaryContact}
          powerAware={powerAware}
          connectionPrice={gasPrice}
        />
      ) : null}
      </>
    }
      <PageNavigationActions prevLink="/personal-detail-1" nextDisabled={registrationData.nextPageDisabled}/>
    </form>
  )
}

export default PersonalDetailPage2
