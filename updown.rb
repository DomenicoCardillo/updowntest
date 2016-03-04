#!/usr/bin/env ruby

N = 50
randomArray = Array.new
binaryArray = Array.new

# Generate Random number [0,1]
randomArray = N.times.map{ Random.rand(0..1.0).round(1) } 

puts randomArray
puts "========="

# Generate 0/1 array
randomArray.each_with_index do |r, i|
	
	if randomArray[i + 1] == nil
		break
	end

	if randomArray[i] > randomArray[i + 1]
		binaryArray.push(0)
	else
		binaryArray.push(1)
	end
end

puts binaryArray
puts "========="

countTmp = 1
countRuns = Array.new

binaryArray.each_with_index do |r, i|

	if binaryArray[i] === binaryArray[i + 1]
		countTmp = countTmp + 1
	else
		if binaryArray[i] === 0
			countRuns.push("Down: #{countTmp}")
		else
			countRuns.push("Up: #{countTmp}")
		end	

		countTmp = 1
	end
end

puts countRuns
puts "========="

puts countRuns.length
puts "========="

# mean = (2 * N) / 3
# variance = (16 + N) / 90
# Zo = (countRuns.length - mean) / Math::sqrt(variance)

# puts "Critical value are #{Zo}"