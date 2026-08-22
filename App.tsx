import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChatPage } from './components/ChatPage';
import { DeliveriesPage, Job } from './components/DeliveriesPage';
import { HomePage } from './components/HomePage';
import { MeetingsPage } from './components/MeetingsPage';
import { ACCEPT_ORDER_ACTION, configureDriverNotifications, dismissDriverOrderNotification, REJECT_ORDER_ACTION } from './notifications';

const jobs: Job[] = [
  { type: 'Package transfer', pickup: 'Riverside Market', dropoff: 'City Hall', time: 'Now', fare: '$18.40', background: '#fff0dc', color: '#d97706' },
  { type: 'Bike courier', pickup: 'North Loop Cafe', dropoff: 'Juniper Apartments', time: '12:45 PM', fare: '$14.75', background: '#e8f2ff', color: '#2875c7' },
  { type: 'Same-day delivery', pickup: 'Westside Pharmacy', dropoff: 'Oak Street', time: '2:10 PM', fare: '$22.60', background: '#e4f7ef', color: '#21865a' },
];
const activeJob: Job = { type: 'Bike courier', pickup: 'Riverside Market', dropoff: 'City Hall, 2nd floor', time: 'Pickup in 8 min', fare: '$24.80', background: '#e2f3eb', color: '#299060' };
const statuses = ['Heading to pickup', 'Arrived at pickup', 'Out for delivery', 'Delivered'];
const dates = ['Today', 'Tomorrow', 'Aug 25'];
const meetings = [
  { title: 'Driver community check-in', host: 'BuddyDrop Operations', time: '10:00 AM', date: 'Today' },
  { title: 'Weekly delivery tips', host: 'Maya Chen', time: '3:30 PM', date: 'Tomorrow' },
  { title: 'Local route planning', host: 'BuddyDrop Operations', time: '11:00 AM', date: 'Aug 25' },
];
const calendarDays: (number | null)[] = [null, null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
type Screen = 'home' | 'deliveries' | 'meetings' | 'chat';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [online, setOnline] = useState(true);
  const [statusIndex, setStatusIndex] = useState(0);
  const [availableJobs, setAvailableJobs] = useState(jobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [earningsOpen, setEarningsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawType, setWithdrawType] = useState<'full' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);
  const [meetingDate, setMeetingDate] = useState('Today');
  const [selectedDay, setSelectedDay] = useState(22);
  const [joinedMeetings, setJoinedMeetings] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(['Hi Alex, I can help with deliveries, earnings, or account questions.']);
  const customAmountValue = Number(customAmount);
  const customAmountInvalid = withdrawType === 'custom' && (!customAmount.trim() || !Number.isFinite(customAmountValue) || customAmountValue <= 0 || customAmountValue > 86.4);
  useEffect(() => {
    configureDriverNotifications().then((token) => {
      if (token) console.log('Register this driver push token with the backend:', token.data);
    }).catch((error) => console.warn('Driver notifications could not be configured.', error));
    const receivedSubscription = Notifications.addNotificationReceivedListener(() => setScreen('deliveries'));
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const notificationId = response.notification.request.identifier;
      if (response.actionIdentifier === REJECT_ORDER_ACTION) {
        dismissDriverOrderNotification(notificationId).catch(() => undefined);
      } else if (response.actionIdentifier === ACCEPT_ORDER_ACTION || response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        setScreen('deliveries');
      }
    });
    return () => { receivedSubscription.remove(); responseSubscription.remove(); };
  }, []);
  const acceptJob = () => { if (selectedJob) setAvailableJobs((items) => items.filter((job) => job.type !== selectedJob.type)); setSelectedJob(null); };
  const sendChat = () => { if (chatMessage.trim()) { setChatMessages((items) => [...items, chatMessage.trim(), 'Thanks. I am checking that for you.']); setChatMessage(''); } };
  const selectDate = (date: string) => { setMeetingDate(date); setSelectedDay(date === 'Today' ? 22 : date === 'Tomorrow' ? 23 : 25); };

  return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    {screen === 'home' && <HomePage online={online} onToggleOnline={() => setOnline((value) => !value)} onOpenProfile={() => setProfileOpen(true)} onOpenEarnings={() => setEarningsOpen(true)} onOpenWithdraw={() => setWithdrawOpen(true)} onOpenDeliveries={() => setScreen('deliveries')} />}
    {screen === 'deliveries' && <DeliveriesPage activeJob={activeJob} jobs={availableJobs} statusIndex={statusIndex} statuses={statuses} onAdvanceStatus={() => setStatusIndex((index) => Math.min(index + 1, statuses.length - 1))} onSelectJob={setSelectedJob} />}
    {screen === 'meetings' && <MeetingsPage meetingDate={meetingDate} selectedDay={selectedDay} joinedMeetings={joinedMeetings} dates={dates} days={calendarDays} meetings={meetings} onSelectDate={selectDate} onSelectDay={(day) => { setSelectedDay(day); setMeetingDate(day === 22 ? 'Today' : day === 23 ? 'Tomorrow' : day === 25 ? 'Aug 25' : `Aug ${day}`); }} onToggleJoin={(title) => setJoinedMeetings((items) => items.includes(title) ? items.filter((item) => item !== title) : [...items, title])} />}
    {screen === 'chat' && <ChatPage messages={chatMessages} value={chatMessage} onChange={setChatMessage} onSend={sendChat} />}
  </ScrollView><View style={styles.tabBar}><Tab label="Home" icon="H" active={screen === 'home'} onPress={() => setScreen('home')} /><Tab label="Deliveries" icon="D" active={screen === 'deliveries'} onPress={() => setScreen('deliveries')} /><Tab label="Meetings" icon="M" active={screen === 'meetings'} onPress={() => setScreen('meetings')} /><Tab label="Chat" icon="C" active={screen === 'chat'} onPress={() => setScreen('chat')} /></View>
    <Modal visible={selectedJob !== null} transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}><View style={styles.backdrop}><View style={styles.sheet}><Text style={styles.kicker}>DELIVERY DETAILS</Text><Text style={styles.sheetTitle}>{selectedJob?.type}</Text><Text style={styles.fare}>{selectedJob?.fare}</Text><Text style={styles.label}>PICKUP</Text><Text style={styles.address}>{selectedJob?.pickup}</Text><Text style={styles.label}>DROP-OFF</Text><Text style={styles.address}>{selectedJob?.dropoff}</Text><Pressable onPress={selectedJob?.type === activeJob.type && selectedJob.pickup === activeJob.pickup ? () => setSelectedJob(null) : acceptJob} style={styles.button}><Text style={styles.buttonText}>{selectedJob?.type === activeJob.type && selectedJob.pickup === activeJob.pickup ? 'Close' : 'Accept job'}</Text></Pressable></View></View></Modal>
    <Modal visible={profileOpen} transparent animationType="slide" onRequestClose={() => setProfileOpen(false)}><View style={styles.backdrop}><View style={styles.sheet}><Text style={styles.kicker}>DRIVER PROFILE</Text><Text style={styles.sheetTitle}>Alex Morgan</Text><Text style={styles.muted}>alex.morgan@example.com</Text><Text style={styles.row}>Vehicle <Text style={styles.rowValue}>City bike</Text></Text><Text style={styles.row}>Driver rating <Text style={styles.rowValue}>4.9 / 5.0</Text></Text><Pressable onPress={() => setProfileOpen(false)} style={styles.button}><Text style={styles.buttonText}>Done</Text></Pressable></View></View></Modal>
    <Modal visible={earningsOpen} transparent animationType="slide" onRequestClose={() => setEarningsOpen(false)}><View style={styles.backdrop}><View style={styles.sheet}><Text style={styles.kicker}>EARNINGS SUMMARY</Text><Text style={styles.sheetTitle}>$86.40 today</Text>{withdrawalRequested && <Text style={styles.success}>Withdrawal request pending</Text>}<Text style={styles.row}>Delivery pay <Text style={styles.rowValue}>$72.40</Text></Text><Text style={styles.row}>Tips <Text style={styles.rowValue}>$14.00</Text></Text><Pressable onPress={() => { setEarningsOpen(false); setWithdrawOpen(true); }} style={styles.button}><Text style={styles.buttonText}>Request withdrawal</Text></Pressable><Pressable onPress={() => setEarningsOpen(false)} style={styles.cancel}><Text style={styles.muted}>Done</Text></Pressable></View></View></Modal>
    <Modal visible={withdrawOpen} transparent animationType="slide" onRequestClose={() => setWithdrawOpen(false)}><View style={styles.backdrop}><View style={styles.sheet}><Text style={styles.kicker}>WITHDRAW EARNINGS</Text><Text style={styles.sheetTitle}>Request a payout</Text><Text style={styles.muted}>Available balance: $86.40</Text><View style={styles.choiceRow}><Pressable onPress={() => setWithdrawType('full')} style={[styles.choice, withdrawType === 'full' && styles.choiceActive]}><Text style={styles.choiceText}>Full amount</Text></Pressable><Pressable onPress={() => setWithdrawType('custom')} style={[styles.choice, withdrawType === 'custom' && styles.choiceActive]}><Text style={styles.choiceText}>Custom amount</Text></Pressable></View>{withdrawType === 'custom' && <TextInput value={customAmount} onChangeText={setCustomAmount} keyboardType="decimal-pad" placeholder="Enter amount" placeholderTextColor="#8a9c96" style={styles.input} />}{customAmountInvalid && <Text style={styles.error}>{customAmountValue > 86.4 ? 'Amount cannot exceed your $86.40 available balance.' : 'Enter a valid amount greater than $0.'}</Text>}<Pressable disabled={customAmountInvalid} onPress={() => { setWithdrawalRequested(true); setWithdrawOpen(false); }} style={[styles.button, customAmountInvalid && styles.disabled]}><Text style={styles.buttonText}>Submit withdrawal request</Text></Pressable><Pressable onPress={() => setWithdrawOpen(false)} style={styles.cancel}><Text style={styles.muted}>Cancel</Text></Pressable></View></View></Modal>
  </SafeAreaView>;
}

function Tab({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.tab}><Text style={[styles.tabIcon, active && styles.active]}>{icon}</Text><Text style={[styles.tabLabel, active && styles.active]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#102a2b' }, container: { flexGrow: 1, backgroundColor: '#f4f7f5', padding: 22, paddingBottom: 32 }, tabBar: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e1eae5', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 12 }, tab: { alignItems: 'center', minWidth: 70 }, tabIcon: { color: '#8a9c96', fontSize: 16, fontWeight: '800' }, tabLabel: { color: '#8a9c96', fontSize: 10, fontWeight: '700', marginTop: 3 }, active: { color: '#1e6e4e' }, backdrop: { flex: 1, backgroundColor: 'rgba(16, 42, 43, 0.45)', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 24, paddingBottom: 34 }, kicker: { color: '#81928d', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, sheetTitle: { color: '#183536', fontSize: 24, fontWeight: '800', marginTop: 7 }, fare: { color: '#1e6e4e', fontSize: 18, fontWeight: '800', marginTop: 8 }, label: { color: '#8a9c96', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 18 }, address: { color: '#294444', fontSize: 15, fontWeight: '600', marginTop: 4 }, muted: { color: '#71857f', fontSize: 12, marginTop: 8 }, button: { backgroundColor: '#173d3c', borderRadius: 9, paddingVertical: 14, alignItems: 'center', marginTop: 24 }, buttonText: { color: '#fff', fontSize: 13, fontWeight: '800' }, cancel: { alignItems: 'center', paddingVertical: 14 }, row: { borderBottomWidth: 1, borderBottomColor: '#edf1ef', color: '#71857f', paddingVertical: 15, marginTop: 8 }, rowValue: { color: '#294444', fontWeight: '800' }, success: { color: '#1e6e4e', fontSize: 12, fontWeight: '700', marginTop: 8 }, choiceRow: { flexDirection: 'row', gap: 8, marginTop: 22 }, choice: { flex: 1, borderWidth: 1, borderColor: '#d8e3dd', borderRadius: 9, paddingVertical: 12, alignItems: 'center' }, choiceActive: { backgroundColor: '#e2f3eb', borderColor: '#329467' }, choiceText: { color: '#71857f', fontSize: 12, fontWeight: '700' }, input: { borderWidth: 1, borderColor: '#d8e3dd', borderRadius: 9, padding: 13, marginTop: 12, color: '#294444', fontSize: 15 }, error: { color: '#b94a48', fontSize: 11, marginTop: 8 }, disabled: { backgroundColor: '#a9b8b1' } });