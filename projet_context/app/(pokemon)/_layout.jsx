//(pokemon)/_layout.jsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="pokemon-start">
        <NativeTabs.Trigger.Label>Start</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="flag.fill" md="flag" />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="pokemon-end">
        <NativeTabs.Trigger.Label>End</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="flag.checkered" md="check_box" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}