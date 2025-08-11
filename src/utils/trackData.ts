@@ .. @@
 export const parseTimeInput = (input: string): number => {
   // Handle formats like "12.34", "1:23.45", "12:34.56"
   const timePattern = /^(?:(\d+):)?(?:(\d+):)?(\d+(?:\.\d+)?)$/;
   const match = input.match(timePattern);
   
   if (!match) return 0;
   
   const [, hours, minutes, seconds] = match;
   let totalSeconds = parseFloat(seconds || '0');
   
   if (minutes) totalSeconds += parseInt(minutes) * 60;
   if (hours) totalSeconds += parseInt(hours) * 3600;
   
   return totalSeconds;
 };
+
+// Events that are affected by wind conditions
+export const windAffectedEvents: EventType[] = [
+  '100m', '200m', '110m-hurdles', '400m-hurdles', 'long-jump', 'triple-jump'
+];
+
+export const isWindAffectedEvent = (eventType: EventType): boolean => {
+  return windAffectedEvents.includes(eventType);
+};
+
+export const isWindLegal = (windSpeed: number): boolean => {
+  return windSpeed <= 2.0;
+};
+
+export const formatWindSpeed = (windSpeed: number): string => {
+  const sign = windSpeed >= 0 ? '+' : '';
+  return `${sign}${windSpeed.toFixed(1)} m/s`;
+};