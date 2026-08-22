import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type Job = {
  type: string;
  pickup: string;
  dropoff: string;
  time: string;
  fare: string;
  background: string;
  color: string;
};

const jobs: Job[] = [
  { type: 'Package transfer', pickup: 'Riverside Market', dropoff: 'City Hall', time: 'Now', fare: '$18.40', background: '#fff0dc', color: '#d97706' },
  { type: 'Bike courier', pickup: 'North Loop Cafe', dropoff: 'Juniper Apartments', time: '12:45 PM', fare: '$14.75', background: '#e8f2ff', color: '#2875c7' },
  { type: 'Same-day delivery', pickup: 'Westside Pharmacy', dropoff: 'Oak Street', time: '2:10 PM', fare: '$22.60', background: '#e4f7ef', color: '#21865a' },
];

const deliveryStatuses = ['Heading to pickup', 'Arrived at pickup', 'Out for delivery', 'Delivered'];

const activeJob: Job = {
  type: 'Bike courier',
  pickup: 'Riverside Market',
  dropoff: 'City Hall, 2nd floor',
  time: 'Pickup in 8 min',
  fare: '$24.80',
  background: '#e2f3eb',
  color: '#299060',
};

export default function App() {
  const [online, setOnline] = useState(true);
  const [statusIndex, setStatusIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [availableJobs, setAvailableJobs] = useState(jobs);
  const [profileOpen, setProfileOpen] = useState(false);
  const [earningsOpen, setEarningsOpen] = useState(false);

  const advanceStatus = () => setStatusIndex((index) => Math.min(index + 1, deliveryStatuses.length - 1));
  const acceptJob = () => {
    if (selectedJob) setAvailableJobs((items) => items.filter((job) => job.type !== selectedJob.type));
    setSelectedJob(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View><Text style={styles.kicker}>SATURDAY, AUGUST 22</Text><Text style={styles.greeting}>Good morning, Alex</Text></View>
          <Pressable onPress={() => setProfileOpen(true)} style={styles.avatar} accessibilityLabel="Open driver profile"><Text style={styles.avatarText}>A</Text></Pressable>
        </View>
        <View style={styles.availability}>
          <View><View style={styles.onlineRow}><View style={[styles.dot, !online && styles.offlineDot]} /><Text style={styles.onlineText}>{online ? 'You are online' : 'You are offline'}</Text></View><Text style={styles.hint}>{online ? 'Ready for your next delivery' : 'Go online to receive jobs'}</Text></View>
          <Pressable onPress={() => setOnline((value) => !value)} style={[styles.toggle, online && styles.toggleOn]} accessibilityRole="switch" accessibilityState={{ checked: online }}><View style={[styles.thumb, online && styles.thumbOn]} /></Pressable>
        </View>
        <Pressable onPress={() => setEarningsOpen(true)} style={styles.earnings} accessibilityLabel="View earnings breakdown"><View style={styles.earningMain}><Text style={styles.eyebrow}>TODAY'S EARNINGS</Text><Text style={styles.amount}>$86.40</Text><Text style={styles.meta}>5 deliveries  <Text style={styles.positive}>+12%</Text></Text></View><View style={styles.metric}><Text style={styles.metricValue}>4.9</Text><Text style={styles.metricLabel}>Rating</Text></View><View style={styles.metric}><Text style={styles.metricValue}>3h 24m</Text><Text style={styles.metricLabel}>Online</Text></View></Pressable>
        <View style={styles.sectionHeader}><Text style={styles.title}>Active delivery</Text><Text style={styles.muted}>BD-2047</Text></View>
        <View style={styles.card}><View style={styles.deliveryTop}><View style={styles.icon}><Text style={styles.iconText}>B</Text></View><View style={styles.deliveryName}><Text style={styles.deliveryType}>{activeJob.type}</Text><Text style={styles.eta}>{statusIndex === 3 ? 'Completed' : activeJob.time}</Text></View><Text style={styles.fare}>{activeJob.fare}</Text></View><View style={styles.progressRow}>{deliveryStatuses.map((label, index) => <View key={label} style={styles.progressItem}><View style={[styles.progressDot, index <= statusIndex && styles.progressDotActive]} /><Text style={[styles.progressLabel, index === statusIndex && styles.progressLabelActive]}>{label}</Text></View>)}</View><View style={styles.route}><View style={styles.rail}><View style={styles.circle} /><View style={styles.connector} /><View style={[styles.circle, styles.endCircle]} /></View><View style={styles.addresses}><View><Text style={styles.addressLabel}>PICKUP</Text><Text style={styles.address}>{activeJob.pickup}</Text></View><View><Text style={styles.addressLabel}>DROP-OFF</Text><Text style={styles.address}>{activeJob.dropoff}</Text></View></View></View><View style={styles.actions}><Pressable onPress={() => setSelectedJob(activeJob)} style={styles.details}><Text style={styles.detailsText}>View details</Text></Pressable><Pressable disabled={statusIndex === 3} style={[styles.nextAction, statusIndex === 3 && styles.nextActionDisabled]} onPress={advanceStatus}><Text style={styles.nextText}>{statusIndex === 3 ? 'Delivery complete' : deliveryStatuses[statusIndex]}</Text><Text style={styles.arrow}>›</Text></Pressable></View></View>
        <View style={styles.sectionHeader}><Text style={styles.title}>Upcoming jobs</Text><Text style={styles.available}>{availableJobs.length} available</Text></View>
        {availableJobs.length === 0 ? <View style={styles.emptyState}><Text style={styles.emptyTitle}>No more jobs nearby</Text><Text style={styles.emptyText}>Stay online and new requests will appear here.</Text></View> : availableJobs.map((job) => <Pressable key={job.type} onPress={() => setSelectedJob(job)} style={styles.job}><View style={[styles.jobIcon, { backgroundColor: job.background }]}><Text style={{ color: job.color, fontSize: 15 }}>●</Text></View><View style={styles.jobCopy}><Text style={styles.jobType}>{job.type}</Text><Text style={styles.jobRoute}>{job.pickup} <Text style={styles.routeArrow}>→</Text> {job.dropoff}</Text><Text style={styles.jobTime}>{job.time}</Text></View><Text style={styles.jobFare}>{job.fare}</Text></Pressable>)}
      </ScrollView>
      <Modal visible={selectedJob !== null} transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}><View style={styles.modalBackdrop}><View style={styles.sheet}><Text style={styles.sheetKicker}>DELIVERY DETAILS</Text><Text style={styles.sheetTitle}>{selectedJob?.type}</Text><Text style={styles.sheetFare}>{selectedJob?.fare}</Text><Text style={styles.sheetLabel}>PICKUP</Text><Text style={styles.sheetAddress}>{selectedJob?.pickup}</Text><Text style={styles.sheetLabel}>DROP-OFF</Text><Text style={styles.sheetAddress}>{selectedJob?.dropoff}</Text><Text style={styles.sheetMeta}>Estimated route time: 18 min</Text>{selectedJob?.type === activeJob.type && selectedJob?.pickup === activeJob.pickup ? <Pressable onPress={() => setSelectedJob(null)} style={styles.sheetButton}><Text style={styles.sheetButtonText}>Close</Text></Pressable> : <Pressable onPress={acceptJob} style={styles.sheetButton}><Text style={styles.sheetButtonText}>Accept job</Text></Pressable>}<Pressable onPress={() => setSelectedJob(null)} style={styles.cancelButton}><Text style={styles.cancelText}>Cancel</Text></Pressable></View></View></Modal>
      <Modal visible={profileOpen} transparent animationType="slide" onRequestClose={() => setProfileOpen(false)}><View style={styles.modalBackdrop}><View style={styles.sheet}><Text style={styles.sheetKicker}>DRIVER PROFILE</Text><Text style={styles.sheetTitle}>Alex Morgan</Text><Text style={styles.sheetMeta}>alex.morgan@example.com</Text><View style={styles.profileRow}><Text style={styles.profileLabel}>Vehicle</Text><Text style={styles.profileValue}>City bike</Text></View><View style={styles.profileRow}><Text style={styles.profileLabel}>Driver rating</Text><Text style={styles.profileValue}>4.9 / 5.0</Text></View><Pressable onPress={() => setProfileOpen(false)} style={styles.sheetButton}><Text style={styles.sheetButtonText}>Done</Text></Pressable></View></View></Modal>
      <Modal visible={earningsOpen} transparent animationType="slide" onRequestClose={() => setEarningsOpen(false)}><View style={styles.modalBackdrop}><View style={styles.sheet}><Text style={styles.sheetKicker}>EARNINGS SUMMARY</Text><Text style={styles.sheetTitle}>$86.40 today</Text><View style={styles.profileRow}><Text style={styles.profileLabel}>Delivery pay</Text><Text style={styles.profileValue}>$72.40</Text></View><View style={styles.profileRow}><Text style={styles.profileLabel}>Tips</Text><Text style={styles.profileValue}>$14.00</Text></View><View style={styles.profileRow}><Text style={styles.profileLabel}>Completed deliveries</Text><Text style={styles.profileValue}>5</Text></View><Pressable onPress={() => setEarningsOpen(false)} style={styles.sheetButton}><Text style={styles.sheetButtonText}>Done</Text></Pressable></View></View></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#102a2b' },
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5', padding: 22, paddingBottom: 40,
  },
  header: { backgroundColor: '#102a2b', marginHorizontal: -22, marginTop: -22, padding: 22, paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: '#9bb3ad', fontSize: 11, fontWeight: '700', letterSpacing: 1.3 }, greeting: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: 7 }, avatar: { backgroundColor: '#e5b95c', width: 43, height: 43, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#102a2b', fontWeight: '800', fontSize: 17 },
  availability: { backgroundColor: '#fff', borderRadius: 14, marginTop: -12, padding: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 }, onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#38a169' }, offlineDot: { backgroundColor: '#a0aaa6' }, onlineText: { color: '#183536', fontSize: 15, fontWeight: '700' }, hint: { color: '#78908b', fontSize: 12, marginTop: 5 }, toggle: { width: 50, height: 29, borderRadius: 16, backgroundColor: '#d4dfda', padding: 3, justifyContent: 'center' }, toggleOn: { backgroundColor: '#329467' }, thumb: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#fff' }, thumbOn: { alignSelf: 'flex-end' },
  earnings: { flexDirection: 'row', paddingVertical: 28, gap: 19 }, earningMain: { flex: 1 }, eyebrow: { color: '#81928d', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, amount: { color: '#173738', fontSize: 34, fontWeight: '800', marginTop: 4 }, meta: { color: '#6d817b', fontSize: 12, marginTop: 3 }, positive: { color: '#228658', fontWeight: '700' }, metric: { borderLeftWidth: 1, borderLeftColor: '#d9e3de', paddingLeft: 17, justifyContent: 'center', minWidth: 65 }, metricValue: { color: '#173738', fontWeight: '800', fontSize: 16 }, metricLabel: { color: '#81928d', fontSize: 11, marginTop: 5 }, progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }, progressItem: { alignItems: 'center', flex: 1 }, progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d5dfda', marginBottom: 5 }, progressDotActive: { backgroundColor: '#329467' }, progressLabel: { color: '#9aa9a3', fontSize: 8, textAlign: 'center' }, progressLabelActive: { color: '#329467', fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }, title: { color: '#183536', fontSize: 18, fontWeight: '800' }, muted: { color: '#859790', fontSize: 12, fontWeight: '700' }, available: { color: '#329467', fontSize: 12, fontWeight: '700' }, card: { backgroundColor: '#fff', borderRadius: 15, padding: 17, marginBottom: 27 }, deliveryTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 }, icon: { backgroundColor: '#e2f3eb', width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, iconText: { color: '#299060', fontSize: 19, fontWeight: '900' }, deliveryName: { flex: 1, marginLeft: 11 }, deliveryType: { color: '#193a3a', fontWeight: '800', fontSize: 15 }, eta: { color: '#329467', fontSize: 12, marginTop: 3 }, fare: { color: '#183536', fontWeight: '800', fontSize: 16 },
  route: { flexDirection: 'row' }, rail: { alignItems: 'center', width: 18, paddingTop: 4 }, circle: { width: 10, height: 10, borderRadius: 5, borderWidth: 3, borderColor: '#329467', backgroundColor: '#fff' }, endCircle: { borderColor: '#e5b95c' }, connector: { width: 1, height: 35, backgroundColor: '#c9d8d1' }, addresses: { flex: 1, gap: 18, marginLeft: 10 }, addressLabel: { color: '#8a9c96', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, address: { color: '#294444', fontSize: 14, fontWeight: '600', marginTop: 4 }, actions: { flexDirection: 'row', gap: 9, marginTop: 22 }, details: { borderWidth: 1, borderColor: '#d8e3dd', borderRadius: 9, paddingVertical: 12, paddingHorizontal: 13 }, detailsText: { color: '#4e6963', fontSize: 12, fontWeight: '700' }, nextAction: { backgroundColor: '#173d3c', flex: 1, borderRadius: 9, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, nextText: { color: '#fff', fontSize: 12, fontWeight: '700' }, arrow: { color: '#e5b95c', fontSize: 22 },
  job: { backgroundColor: '#fff', borderRadius: 13, padding: 14, marginBottom: 9, flexDirection: 'row', alignItems: 'center' }, jobIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, jobCopy: { flex: 1, marginLeft: 11 }, jobType: { color: '#294444', fontSize: 13, fontWeight: '800' }, jobRoute: { color: '#71857f', fontSize: 11, marginTop: 4 }, routeArrow: { color: '#a9b8b1' }, jobTime: { color: '#9aa9a3', fontSize: 10, marginTop: 5 }, jobFare: { color: '#1e6e4e', fontSize: 14, fontWeight: '800' }, emptyState: { backgroundColor: '#eaf4ef', borderRadius: 13, padding: 20, marginBottom: 9 }, emptyTitle: { color: '#1f5e4a', fontSize: 14, fontWeight: '800' }, emptyText: { color: '#6d817b', fontSize: 12, marginTop: 5 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(16, 42, 43, 0.45)', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 24, paddingBottom: 34 }, sheetKicker: { color: '#81928d', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, sheetTitle: { color: '#183536', fontSize: 24, fontWeight: '800', marginTop: 7 }, sheetFare: { color: '#1e6e4e', fontSize: 18, fontWeight: '800', marginTop: 4, marginBottom: 24 }, sheetLabel: { color: '#8a9c96', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 13 }, sheetAddress: { color: '#294444', fontSize: 15, fontWeight: '600', marginTop: 4 }, sheetMeta: { color: '#71857f', fontSize: 12, marginTop: 20 }, sheetButton: { backgroundColor: '#173d3c', borderRadius: 9, paddingVertical: 14, alignItems: 'center', marginTop: 24 }, sheetButtonText: { color: '#fff', fontSize: 13, fontWeight: '800' }, cancelButton: { alignItems: 'center', paddingVertical: 14 }, cancelText: { color: '#71857f', fontSize: 13, fontWeight: '700' }, profileRow: { borderBottomWidth: 1, borderBottomColor: '#edf1ef', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }, profileLabel: { color: '#71857f', fontSize: 13 }, profileValue: { color: '#294444', fontSize: 13, fontWeight: '800' }, nextActionDisabled: { backgroundColor: '#769087' },
});
