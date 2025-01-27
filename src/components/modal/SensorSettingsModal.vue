<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Sensor Settings</h3>

            <!-- Close Button -->
            <button class="close-button" @click="$emit('close')">X</button>

            <!-- Name Section -->
            <div class="section">
                <h4>Change Sensor Name</h4>
                <input v-model="localName" type="text" class="input" />
                <button @click="changeName" class="add-button">Change Name</button>
            </div>

            <!-- Days Section -->
            <div class="section">
                <h4>Cronjob days [format: dd-dd]</h4>
                <input v-model="newDay" type="text" placeholder="Add a day" class="input" />
                <button @click="addDay" class="add-button">Add Day</button>
            </div>

            <!-- Working Hours Section -->
            <div class="section">
                <h4>Cronjob Time</h4>
                <div class="time-inputs">
                    <input
                        v-model.number="localWorkingHours.hours"
                        type="number"
                        class="input"
                        max="23"
                        min="0"
                        placeholder="Hours"
                    />
                    <input
                        v-model.number="localWorkingHours.minutes"
                        type="number"
                        max="59"
                        min="0"
                        class="input"
                        placeholder="Minutes"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UPDATE_CRONJOB_DAYS, UPDATE_NAME_ACTION } from '@/headers/sensorHeaders';
import { ref, reactive } from 'vue';

const props = defineProps({
    name: { type: String, required: true },
    days: { type: Array, default: () => [] },
    workingHours: { type: Object, default: () => ({ hours: 0, minutes: 0 }) },
});

const emit = defineEmits(['close', 'save']);

const localName = ref(props.name);
const localWorkingHours = reactive({ ...props.workingHours });
const newDay = ref('');
const message = {
    action: '',
    name: '',
    days: '',
    hour: '',
    minute: '',
};

const updateAction = (action: string) => {
    message.action = action;
};

const prepareUpdateName = (newName: string) => {
    updateAction(UPDATE_NAME_ACTION);
    message.name = newName;
};

const prepareUpdateDays = (days: string) => {
    updateAction(UPDATE_CRONJOB_DAYS);
    message.days = days;
};

const close = () => {
    emit('close');
};

const addDay = () => {
    if (newDay.value.trim()) {
        prepareUpdateDays(newDay.value);
        emit('save', message);
        close();
    }
};

const changeName = async () => {
    if (localName.value.trim()) {
        prepareUpdateName(localName.value);
        emit('save', message);
        close();
    }
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white; /* Ensure a white background for the modal */
    color: #333; /* Set text color to ensure visibility */
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    max-width: 90%;
    position: relative;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* Add a shadow for contrast */
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.section {
    margin-bottom: 20px;
}

.section h4 {
    color: #333; /* Ensure section headers are visible */
    margin-bottom: 10px;
}

.input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
    color: #333; /* Ensure input text is visible */
    background: #fff;
}

.add-button,
.remove-button,
.save-button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #4caf50; /* Button background color */
    color: white; /* Button text color */
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
}

.add-button:hover,
.remove-button:hover,
.save-button:hover {
    background-color: #45a049; /* Darken the button slightly on hover */
}

.time-inputs {
    display: flex;
    gap: 10px;
}

.time-inputs input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
    color: #333;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    color: #333; /* Ensure list items are visible */
}

.remove-button {
    background-color: #f44336; /* Red for delete buttons */
    color: white;
}

.remove-button:hover {
    background-color: #d32f2f; /* Darker red on hover */
}
</style>
