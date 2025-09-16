import { CustomGradient } from '@/components/CustomGradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useFinanceStore } from '@/store/financeStore';
import { calculateIncomeTax, calculateVat } from '@/utils/financeUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

export default function VatCalculatorScreen() {
  const router = useRouter();
  const {
    vatAmount,
    isAddingVat,
    annualIncome,
    vatResults,
    taxResults,
    setVatInputs,
    setAnnualIncome,
    addVatResult,
    addTaxResult,
  } = useFinanceStore();

  const [amount, setAmount] = useState(vatAmount);
  const [addingVat, setAddingVat] = useState(isAddingVat);
  const [monthlyIncome, setMonthlyIncome] = useState(annualIncome ? (annualIncome / 12).toString() : '');
  const [vatResult, setVatResult] = useState<any>(null);
  const [taxResult, setTaxResult] = useState<any>(null);

  useEffect(() => {
    setAmount(vatAmount);
    setAddingVat(isAddingVat);
    if (annualIncome) {
      setMonthlyIncome((annualIncome / 12).toString());
    }
  }, [vatAmount, isAddingVat, annualIncome]);

  const handleVatCalculate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive amount.');
      return;
    }

    const calculation = calculateVat(numAmount, addingVat);
    setVatResult(calculation);
    setVatInputs(amount, addingVat);
    addVatResult({ ...calculation, amount: numAmount, isAddingVat: addingVat });
  };

  const handleTaxCalculate = () => {
    const numMonthlyIncome = parseFloat(monthlyIncome);
    if (isNaN(numMonthlyIncome) || numMonthlyIncome <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive monthly income.');
      return;
    }

    // Convert monthly to annual for tax calculation
    const annualIncome = numMonthlyIncome * 12;
    const calculation = calculateIncomeTax(annualIncome);
    setTaxResult(calculation);
    setAnnualIncome(annualIncome.toString());
    addTaxResult({ ...calculation, annualIncome });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* VAT Calculator */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>VAT Calculator (15%)</ThemedText>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Amount (R)</ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="cash" size={20} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
            </View>
          </ThemedView>

          <ThemedView style={styles.switchGroup}>
            <ThemedText style={styles.label}>Add VAT</ThemedText>
            <Switch
              value={addingVat}
              onValueChange={setAddingVat}
              trackColor={{ false: Colors.secondary, true: Colors.primary }}
              thumbColor={addingVat ? Colors.accent : Colors.secondary}
            />
            <ThemedText style={styles.switchText}>
              {addingVat ? 'Adding VAT' : 'Removing VAT'}
            </ThemedText>
          </ThemedView>

          <TouchableOpacity style={styles.calculateButton} onPress={handleVatCalculate}>
            <CustomGradient
              colors={[Colors.primary, Colors.accent]}
              style={styles.buttonGradient}
            >
              <ThemedText style={[styles.buttonText, { fontFamily: 'InterBold' }]}>Calculate VAT</ThemedText>
            </CustomGradient>
          </TouchableOpacity>

          {vatResult && (
            <ThemedView style={styles.results}>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="receipt" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>VAT Amount:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>R{vatResult.vatAmount.toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="wallet" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>Total Amount:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>R{vatResult.totalAmount.toFixed(2)}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>

        {/* Income Tax Calculator */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Income Tax Calculator</ThemedText>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Monthly Salary (R)</ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="trending-up" size={20} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                keyboardType="numeric"
                placeholder="Enter monthly salary"
              />
            </View>
          </ThemedView>

          <TouchableOpacity style={styles.calculateButton} onPress={handleTaxCalculate}>
            <CustomGradient
              colors={[Colors.primary, Colors.accent]}
              style={styles.buttonGradient}
            >
              <ThemedText style={[styles.buttonText, { fontFamily: 'MontiBold' }]}>Calculate Tax</ThemedText>
            </CustomGradient>
          </TouchableOpacity>

          {taxResult && (
            <ThemedView style={styles.results}>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="cash" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>Monthly Salary:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>R{parseFloat(monthlyIncome).toLocaleString()}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="calculator" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>Annual Tax:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>R{taxResult.totalTax.toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>UIF Deduction:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>R{taxResult.uifDeduction.toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="wallet" size={20} color={Colors.success} />
                  <ThemedText style={styles.resultLabel}>Net Salary:</ThemedText>
                </View>
                <ThemedText style={[styles.resultValue, { color: Colors.success }]}>R{taxResult.netSalary.toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="calendar" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>Monthly Net:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>R{(taxResult.netSalary / 12).toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.resultItem}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="stats-chart" size={20} color={Colors.primary} />
                  <ThemedText style={styles.resultLabel}>Tax Rate:</ThemedText>
                </View>
                <ThemedText style={styles.resultValue}>{taxResult.effectiveRate.toFixed(2)}%</ThemedText>
              </ThemedView>
              <ThemedText style={styles.bracketsTitle}>Tax Breakdown by Bracket:</ThemedText>
              {taxResult.taxBrackets.map((bracket: any, index: number) => (
                <ThemedView key={index} style={styles.bracketItem}>
                  <ThemedText style={styles.bracketText}>{bracket.bracket}</ThemedText>
                  <ThemedText style={styles.bracketTax}>R{bracket.tax.toFixed(2)}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>

        {/* History */}
        {(vatResults.length > 0 || taxResults.length > 0) && (
          <ThemedView style={styles.history}>
            <ThemedText style={styles.historyTitle}>Recent Calculations</ThemedText>
            {vatResults.slice(0, 3).map((item) => (
              <ThemedView key={item.id} style={styles.historyItem}>
                <ThemedText style={styles.historyText}>
                  VAT: R{item.amount} ({item.isAddingVat ? 'Add' : 'Remove'})
                </ThemedText>
                <ThemedText style={styles.historyResult}>
                  Total: R{item.totalAmount.toFixed(2)}
                </ThemedText>
              </ThemedView>
            ))}
            {taxResults.slice(0, 3).map((item) => (
              <ThemedView key={item.id} style={styles.historyItem}>
                <ThemedText style={styles.historyText}>
                  Tax: R{item.annualIncome}
                </ThemedText>
                <ThemedText style={styles.historyResult}>
                  Tax: R{item.totalTax.toFixed(2)}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
    fontFamily: 'MontiBold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'MontiLight',
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: 'MontiLight',
  },
  calculateButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
  },
  results: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 15,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultLabel: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: 'MontiLight',
    marginLeft: 8,
  },
  resultValue: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  bracketsTitle: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'MontiBold',
  },
  bracketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bracketText: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
    fontFamily: 'MontiLight',
  },
  bracketTax: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'MontiLight',
  },
  history: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  historyTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
    fontFamily: 'MontiBold',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  historyText: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: 'MontiLight',
  },
  historyResult: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'MontiBold',
    marginTop: 5,
  },
});