// ============================================================
//  MyTaskList App — Mini Project P07
//  Integrasi: P01 Setup · P02 Komponen · P03 StyleSheet
//             P04 useState · P05 Form Input · P06 FlatList
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';

// ── Konstanta Prioritas ──────────────────────────────────────
const PRIORITY = {
  HIGH:   { label: '🔴 Tinggi',  color: '#ff5555', bg: '#2d1515' },
  MEDIUM: { label: '🟡 Sedang',  color: '#f1c40f', bg: '#2a2510' },
  LOW:    { label: '🟢 Rendah',  color: '#2ecc71', bg: '#0f2a1a' },
};

const FILTERS = ['Semua', 'Aktif', 'Selesai'];

// ── Komponen Utama ───────────────────────────────────────────
export default function App() {
  // ── State (P04) ─────────────────────────────────────────────
  const [inputText, setInputText]         = useState('');
  const [tasks, setTasks]                 = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('MEDIUM');
  const [activeFilter, setActiveFilter]   = useState('Semua');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [inputError, setInputError]       = useState('');

  // ── Derived Data ─────────────────────────────────────────────
  const totalDone   = tasks.filter(t => t.done).length;
  const totalTasks  = tasks.length;

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'Aktif')   return !task.done;
    if (activeFilter === 'Selesai') return task.done;
    return true;
  });

  // ── Fungsi CRUD ──────────────────────────────────────────────

  // ADD TASK (P05 Validasi)
  const addTask = () => {
    if (inputText.trim() === '') {
      setInputError('Task tidak boleh kosong ya, Bro! ✍️');
      return;
    }
    if (inputText.trim().length < 3) {
      setInputError('Minimal 3 karakter dong 😅');
      return;
    }
    setInputError('');

    const newTask = {
      id:       Date.now(),
      text:     inputText.trim(),
      priority: selectedPriority,
      done:     false,
      time:     new Date().toLocaleTimeString('id-ID', {
                  hour: '2-digit', minute: '2-digit',
                }),
      date:     new Date().toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'short',
                }),
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
    setSelectedPriority('MEDIUM');
  };

  // DELETE TASK
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // TOGGLE DONE (Mark as Done — Bonus +5)
  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  // CLEAR ALL
  const clearAll = () => {
    if (tasks.length === 0) return;
    setTasks([]);
  };

  // ── Render Item FlatList (P06) ────────────────────────────────
  const renderTask = ({ item }) => {
    const prio = PRIORITY[item.priority];
    return (
      <View style={[styles.taskCard, item.done && styles.taskCardDone]}>
        {/* Garis kiri warna prioritas */}
        <View style={[styles.priorityBar, { backgroundColor: prio.color }]} />

        {/* Tombol centang done */}
        <TouchableOpacity
          style={[styles.checkbox, item.done && styles.checkboxDone]}
          onPress={() => toggleDone(item.id)}
        >
          {item.done && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Konten teks */}
        <View style={styles.taskBody}>
          <Text style={[styles.taskText, item.done && styles.taskTextDone]}>
            {item.text}
          </Text>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: prio.bg, borderColor: prio.color }]}>
              <Text style={[styles.priorityLabel, { color: prio.color }]}>
                {prio.label}
              </Text>
            </View>
            <Text style={styles.taskTime}>{item.date} · {item.time}</Text>
          </View>
        </View>

        {/* Tombol hapus */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Render Utama ─────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appTitle}>✅ MyTaskList</Text>
              <Text style={styles.appDate}>
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </Text>
            </View>
            {tasks.length > 0 && (
              <TouchableOpacity style={styles.clearAllBtn} onPress={clearAll}>
                <Text style={styles.clearAllText}>Hapus Semua</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Counter Selesai (Bonus +5) */}
          {totalTasks > 0 && (
            <View style={styles.counterRow}>
              <View style={styles.counterBar}>
                <View style={[
                  styles.counterFill,
                  { width: `${(totalDone / totalTasks) * 100}%` }
                ]} />
              </View>
              <Text style={styles.counterLabel}>
                {totalDone}/{totalTasks} selesai
              </Text>
            </View>
          )}
        </View>

        {/* ── FORM INPUT (P05) ── */}
        <View style={styles.formSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                isInputFocused && styles.inputFocused,
                inputError ? styles.inputError : null,
              ]}
              placeholder="Tambah task baru..."
              placeholderTextColor="#444"
              value={inputText}
              onChangeText={(t) => { setInputText(t); setInputError(''); }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              maxLength={120}
              returnKeyType="done"
              onSubmitEditing={addTask}
            />

            {/* Pilih Prioritas (Bonus +5) */}
            <TouchableOpacity
              style={[styles.prioBtn, { borderColor: PRIORITY[selectedPriority].color }]}
              onPress={() => setShowPriorityModal(true)}
            >
              <Text style={{ fontSize: 18 }}>
                {selectedPriority === 'HIGH' ? '🔴' : selectedPriority === 'MEDIUM' ? '🟡' : '🟢'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={addTask}>
              <Text style={styles.addBtnText}>＋</Text>
            </TouchableOpacity>
          </View>

          {/* Error / char counter */}
          {inputError ? (
            <Text style={styles.errorText}>{inputError}</Text>
          ) : inputText.length > 0 ? (
            <Text style={[
              styles.charCount,
              { color: inputText.length > 100 ? '#ff5555' : '#555' }
            ]}>
              {inputText.length}/120
            </Text>
          ) : null}
        </View>

        {/* ── FILTER TAB (Bonus +5) ── */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
                {f === 'Semua'   && totalTasks > 0   ? ` (${totalTasks})`  : ''}
                {f === 'Aktif'   ? ` (${tasks.filter(t => !t.done).length})` : ''}
                {f === 'Selesai' ? ` (${totalDone})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── FLAT LIST (P06) ── */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>
                {activeFilter === 'Selesai' ? 'Belum ada yang selesai' :
                 activeFilter === 'Aktif'   ? 'Semua task sudah beres!' :
                 'Belum ada task'}
              </Text>
              <Text style={styles.emptyHint}>
                {activeFilter === 'Semua' ? 'Yuk tambah task pertamamu! 🚀' : ''}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

      </KeyboardAvoidingView>

      {/* ── MODAL PILIH PRIORITAS ── */}
      <Modal
        visible={showPriorityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPriorityModal(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Prioritas</Text>
            {Object.entries(PRIORITY).map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.modalOption,
                  selectedPriority === key && { borderColor: val.color, backgroundColor: val.bg },
                ]}
                onPress={() => {
                  setSelectedPriority(key);
                  setShowPriorityModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: val.color }]}>
                  {val.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

// ── STYLESHEET (P03) ─────────────────────────────────────────
const styles = StyleSheet.create({
  flex:     { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#0a0e1a' },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appTitle: {
    color: '#7c6ff7',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appDate: {
    color: '#4a5068',
    fontSize: 12,
    marginTop: 3,
  },
  clearAllBtn: {
    backgroundColor: '#2d1515',
    borderWidth: 1,
    borderColor: '#ff5555',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  clearAllText: { color: '#ff5555', fontSize: 12, fontWeight: '600' },

  // Progress bar counter
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  counterBar: {
    flex: 1,
    height: 5,
    backgroundColor: '#1a1f2e',
    borderRadius: 4,
    overflow: 'hidden',
  },
  counterFill: {
    height: '100%',
    backgroundColor: '#7c6ff7',
    borderRadius: 4,
  },
  counterLabel: { color: '#4a5068', fontSize: 12 },

  // Form
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#12172a',
    color: '#e8eaf0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: '#1e2440',
    minHeight: 48,
  },
  inputFocused: { borderColor: '#7c6ff7' },
  inputError:   { borderColor: '#ff5555' },

  prioBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#12172a',
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#7c6ff7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '300', marginTop: -2 },

  errorText: { color: '#ff5555', fontSize: 12, marginTop: 6, marginLeft: 4 },
  charCount:  { fontSize: 11, marginTop: 4, textAlign: 'right' },

  // Filter tabs
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#12172a',
    borderWidth: 1,
    borderColor: '#1e2440',
  },
  filterTabActive: {
    backgroundColor: '#1e1a3a',
    borderColor: '#7c6ff7',
  },
  filterText:       { color: '#4a5068', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#7c6ff7' },

  // FlatList
  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24, flexGrow: 1 },

  // Task Card
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12172a',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e2440',
  },
  taskCardDone: { opacity: 0.55 },
  priorityBar: { width: 4, alignSelf: 'stretch' },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2e3555',
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#7c6ff7', borderColor: '#7c6ff7' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '800' },

  taskBody: { flex: 1, paddingVertical: 14, paddingRight: 4 },
  taskText: { color: '#e8eaf0', fontSize: 14, lineHeight: 20 },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#3a4060',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  priorityLabel: { fontSize: 10, fontWeight: '700' },
  taskTime: { color: '#3a4060', fontSize: 10 },

  deleteBtn: {
    padding: 14,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: '#2e3555', fontSize: 16, fontWeight: '700' },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon:  { fontSize: 52, marginBottom: 16 },
  emptyTitle: { color: '#3a4060', fontSize: 16, fontWeight: '700' },
  emptyHint:  { color: '#2a2f48', fontSize: 13, marginTop: 6 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#12172a',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: '#1e2440',
  },
  modalTitle: {
    color: '#e8eaf0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1e2440',
    marginBottom: 8,
  },
  modalOptionText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
});