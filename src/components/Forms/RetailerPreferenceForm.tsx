import AGLPreference from '../../components/Preferences/AGLPreference'
import BlueNRGPreference from '../../components/Preferences/BlueNRGPreference'
import SimplyEnergyPreference from '../../components/Preferences/SimplyEnergyPreference'
import EnergyAUPreference from '../../components/Preferences/EnergyAUPreference'
import EnergyLocalsPreference from '../../components/Preferences/EnergyLocalsPreference'
import MomentumEnergyPreference from '../../components/Preferences/MomentumEnergyPreference'
import NextBusinessEnergyPreference from '../../components/Preferences/NextBusinessEnergyPreference'
import {
  AGL,
  BLUE_NRG,
  ENERGY_AU,
  ENERGY_LOCALS,
  MOMENTUM,
  NEXT_BUSINESS_ENERGY,
  SIMPLY_ENERGY,
} from '../../constants'
import { Control } from 'react-hook-form'

const RetailerPreferenceForm = ({ retailerName, prefix, control, siteAddress }: RetailerPreferenceFormProps) => {
  switch (retailerName) {
    case AGL:
      return <AGLPreference control={control} prefix={prefix} />
    case BLUE_NRG:
      return <BlueNRGPreference control={control} prefix={prefix} />
    case SIMPLY_ENERGY:
      return <SimplyEnergyPreference />
    case ENERGY_AU:
      return <EnergyAUPreference siteAddress={siteAddress} control={control} prefix={prefix} />
    case ENERGY_LOCALS:
      return <EnergyLocalsPreference control={control} prefix={prefix} />
    case MOMENTUM:
      return <MomentumEnergyPreference control={control} prefix={prefix} />
    case NEXT_BUSINESS_ENERGY:
      return <NextBusinessEnergyPreference control={control} prefix={prefix} />
  }
}

interface RetailerPreferenceFormProps {
  retailerName: string
  prefix: string
  control: Control
  siteAddress?: string
}

export default RetailerPreferenceForm
