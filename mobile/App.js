import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  Bell,
  CalendarDays,
  ClipboardList,
  House,
  MessageCircle,
  Search,
  UserPlus,
  UsersRound,
} from 'lucide-react-native'

const colors = {
  cream: '#f3f0e5',
  green: '#00432f',
  gold: '#96721a',
  paleGold: '#fff4d5',
  text: '#183c30',
}

const metrics = [
  { label: 'Showing Orders', count: '0', icon: ClipboardList },
  { label: 'Active Clients', count: '0', icon: UsersRound },
  { label: 'Task Due', count: '0', icon: Bell },
  { label: 'New Leads', count: '0', icon: UserPlus },
  { label: 'Missed Messages', count: '0', icon: MessageCircle },
]

const tabs = [
  { label: 'Dashboard', icon: House },
  { label: 'Resources', icon: Search },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Clients', icon: UsersRound },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          {activeTab === 'Dashboard' ? (
            <>
              <View style={styles.header}>
                <Text style={styles.eyebrow}>REAL ASSIST COMMAND CENTER</Text>
                <Text style={styles.title}>Welcome back, Agent!</Text>
                <Text style={styles.subtitle}>Here&apos;s what&apos;s happening today.</Text>
              </View>

              <View style={styles.grid}>
                {metrics.map(({ label, count, icon: Icon }) => (
                  <View style={styles.card} key={label}>
                    <View style={styles.iconBox}>
                      <Icon size={18} color={colors.gold} strokeWidth={2} />
                    </View>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.count}>{count}</Text>
                    <Text style={styles.link}>View all</Text>
                  </View>
                ))}
              </View>

              <View style={styles.assistant}>
                <Text style={styles.assistantEyebrow}>YOUR AI ASSISTANT</Text>
                <Text style={styles.assistantTitle}>How can I help you today?</Text>
              </View>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderTitle}>{activeTab}</Text>
              <Text style={styles.placeholderText}>
                This screen has not been built in the mobile app yet.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.tabBar}>
          {tabs.map(({ label, icon: Icon }) => {
            const active = activeTab === label

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={label}
                onPress={() => setActiveTab(label)}
                style={styles.tab}
              >
                <Icon size={20} color={active ? colors.green : '#89958e'} />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.cream },
  screen: { flex: 1 },
  content: { padding: 18, paddingBottom: 28 },
  header: {
    backgroundColor: colors.green,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  eyebrow: { color: '#e6c45f', fontSize: 11, fontWeight: '700' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#fff', fontSize: 14, marginTop: 6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    minHeight: 140,
    backgroundColor: '#fff',
    borderColor: '#eee3ce',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 7,
    backgroundColor: colors.paleGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: { color: colors.text, fontSize: 12, fontWeight: '700' },
  count: { color: colors.green, fontSize: 24, fontWeight: '700', marginTop: 6 },
  link: { color: colors.gold, fontSize: 11, fontWeight: '700', marginTop: 4 },
  assistant: {
    backgroundColor: colors.green,
    borderRadius: 12,
    padding: 20,
    marginTop: 4,
  },
  assistantEyebrow: { color: '#e6c45f', fontSize: 11, fontWeight: '700' },
  assistantTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 8 },
  placeholder: { paddingTop: 24 },
  placeholderTitle: { color: colors.green, fontSize: 24, fontWeight: '700' },
  placeholderText: { color: colors.text, fontSize: 14, marginTop: 8 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee3ce',
    paddingTop: 10,
    paddingBottom: 8,
  },
  tab: { alignItems: 'center', gap: 4, minWidth: 64 },
  tabLabel: { color: '#89958e', fontSize: 10 },
  tabLabelActive: { color: colors.green, fontWeight: '700' },
})