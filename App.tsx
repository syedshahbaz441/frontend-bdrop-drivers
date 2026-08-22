import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const jobs = [
  ['Package transfer', 'Riverside Market', 'City Hall', 'Now', '$18.40', '#fff0dc', '#d97706'],
  ['Bike courier', 'North Loop Cafe', 'Juniper Apartments', '12:45 PM', '$14.75', '#e8f2ff', '#2875c7'],
  ['Same-day delivery', 'Westside Pharmacy', 'Oak Street', '2:10 PM', '$22.60', '#e4f7ef', '#21865a'],
];

export default function App() {
  const [online, setOnline] = useState(true);
  const [status, setStatus] = useState('Heading to pickup');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View><Text style={styles.kicker}>SATURDAY, AUGUST 22</Text><Text style={styles.greeting}>Good morning, Alex</Text></View>
          <Pressable style={styles.avatar} accessibilityLabel="Open driver profile"><Text style={styles.avatarText}>A</Text></Pressable>
        </View>
        <View style={styles.availability}>
          <View><View style={styles.onlineRow}><View style={[styles.dot, !online && styles.offlineDot]} /><Text style={styles.onlineText}>{online ? 'You are online' : 'You are offline'}</Text></View><Text style={styles.hint}>{online ? 'Ready for your next delivery' : 'Go online to receive jobs'}</Text></View>
          <Pressable onPress={() => setOnline(!online)} style={[styles.toggle, online && styles.toggleOn]} accessibilityRole="switch" accessibilityState={{ checked: online }}><View style={[styles.thumb, online && styles.thumbOn]} /></Pressable>
        </View>
        <View style={styles.earnings}><View style={styles.earningMain}><Text style={styles.eyebrow}>TODAY'S EARNINGS</Text><Text style={styles.amount}>$86.40</Text><Text style={styles.meta}>5 deliveries  <Text style={styles.positive}>+12%</Text></Text></View><View style={styles.metric}><Text style={styles.metricValue}>4.9</Text><Text style={styles.metricLabel}>Rating</Text></View><View style={styles.metric}><Text style={styles.metricValue}>3h 24m</Text><Text style={styles.metricLabel}>Online</Text></View></View>
        <View style={styles.sectionHeader}><Text style={styles.title}>Active delivery</Text><Text style={styles.muted}>BD-2047</Text></View>
        <View style={styles.card}><View style={styles.deliveryTop}><View style={styles.icon}><Text style={styles.iconText}>B</Text></View><View style={styles.deliveryName}><Text style={styles.deliveryType}>Bike courier</Text><Text style={styles.eta}>Pickup in 8 min</Text></View><Text style={styles.fare}>$24.80</Text></View><View style={styles.route}><View style={styles.rail}><View style={styles.circle} /><View style={styles.connector} /><View style={[styles.circle, styles.endCircle]} /></View><View style={styles.addresses}><View><Text style={styles.addressLabel}>PICKUP</Text><Text style={styles.address}>Riverside Market</Text></View><View><Text style={styles.addressLabel}>DROP-OFF</Text><Text style={styles.address}>City Hall, 2nd floor</Text></View></View></View><View style={styles.actions}><Pressable style={styles.details}><Text style={styles.detailsText}>View details</Text></Pressable><Pressable style={styles.nextAction} onPress={() => setStatus(status === 'Heading to pickup' ? 'Arrived at pickup' : 'Heading to pickup')}><Text style={styles.nextText}>{status}</Text><Text style={styles.arrow}>›</Text></Pressable></View></View>
        <View style={styles.sectionHeader}><Text style={styles.title}>Upcoming jobs</Text><Text style={styles.available}>3 available</Text></View>
        {jobs.map(([type, pickup, dropoff, time, fare, background, color]) => <Pressable key={type} style={styles.job}><View style={[styles.jobIcon, { backgroundColor: background }]}><Text style={{ color, fontSize: 15 }}>●</Text></View><View style={styles.jobCopy}><Text style={styles.jobType}>{type}</Text><Text style={styles.jobRoute}>{pickup} <Text style={styles.routeArrow}>→</Text> {dropoff}</Text><Text style={styles.jobTime}>{time}</Text></View><Text style={styles.jobFare}>{fare}</Text></Pressable>)}
      </ScrollView>
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
  earnings: { flexDirection: 'row', paddingVertical: 28, gap: 19 }, earningMain: { flex: 1 }, eyebrow: { color: '#81928d', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, amount: { color: '#173738', fontSize: 34, fontWeight: '800', marginTop: 4 }, meta: { color: '#6d817b', fontSize: 12, marginTop: 3 }, positive: { color: '#228658', fontWeight: '700' }, metric: { borderLeftWidth: 1, borderLeftColor: '#d9e3de', paddingLeft: 17, justifyContent: 'center', minWidth: 65 }, metricValue: { color: '#173738', fontWeight: '800', fontSize: 16 }, metricLabel: { color: '#81928d', fontSize: 11, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }, title: { color: '#183536', fontSize: 18, fontWeight: '800' }, muted: { color: '#859790', fontSize: 12, fontWeight: '700' }, available: { color: '#329467', fontSize: 12, fontWeight: '700' }, card: { backgroundColor: '#fff', borderRadius: 15, padding: 17, marginBottom: 27 }, deliveryTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 }, icon: { backgroundColor: '#e2f3eb', width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, iconText: { color: '#299060', fontSize: 19, fontWeight: '900' }, deliveryName: { flex: 1, marginLeft: 11 }, deliveryType: { color: '#193a3a', fontWeight: '800', fontSize: 15 }, eta: { color: '#329467', fontSize: 12, marginTop: 3 }, fare: { color: '#183536', fontWeight: '800', fontSize: 16 },
  route: { flexDirection: 'row' }, rail: { alignItems: 'center', width: 18, paddingTop: 4 }, circle: { width: 10, height: 10, borderRadius: 5, borderWidth: 3, borderColor: '#329467', backgroundColor: '#fff' }, endCircle: { borderColor: '#e5b95c' }, connector: { width: 1, height: 35, backgroundColor: '#c9d8d1' }, addresses: { flex: 1, gap: 18, marginLeft: 10 }, addressLabel: { color: '#8a9c96', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, address: { color: '#294444', fontSize: 14, fontWeight: '600', marginTop: 4 }, actions: { flexDirection: 'row', gap: 9, marginTop: 22 }, details: { borderWidth: 1, borderColor: '#d8e3dd', borderRadius: 9, paddingVertical: 12, paddingHorizontal: 13 }, detailsText: { color: '#4e6963', fontSize: 12, fontWeight: '700' }, nextAction: { backgroundColor: '#173d3c', flex: 1, borderRadius: 9, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, nextText: { color: '#fff', fontSize: 12, fontWeight: '700' }, arrow: { color: '#e5b95c', fontSize: 22 },
  job: { backgroundColor: '#fff', borderRadius: 13, padding: 14, marginBottom: 9, flexDirection: 'row', alignItems: 'center' }, jobIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, jobCopy: { flex: 1, marginLeft: 11 }, jobType: { color: '#294444', fontSize: 13, fontWeight: '800' }, jobRoute: { color: '#71857f', fontSize: 11, marginTop: 4 }, routeArrow: { color: '#a9b8b1' }, jobTime: { color: '#9aa9a3', fontSize: 10, marginTop: 5 }, jobFare: { color: '#1e6e4e', fontSize: 14, fontWeight: '800' },
});
