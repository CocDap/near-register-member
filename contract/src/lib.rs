


// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc};
use near_sdk::collections::*;

setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Register {
    members: LookupMap<u8,String>,
}

impl Default for Register {
  fn default() -> Self {
    Self {
      members: LookupMap::new(b"member".to_vec()),
    }
  }
}

#[near_bindgen]
impl Register {
    pub fn register(&mut self, slot: u8) {
        let account_id = env::signer_account_id();

        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("'{}' is registering", account_id).as_bytes());

        if self.members.contains_key(&slot) {
            env::panic(format!("Slot is already used").as_bytes());
        }

        else {
            self.members.insert(&slot, &account_id);
        }

    }


    pub fn find_member(&self, slot: u8) -> String {
        match self.members.get(&slot) {
            Some(mem) => mem,
            None => "Undefined".to_string(),
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn register_then_find_slot() {
        let context = get_context(vec![], false);
        testing_env!(context.clone());
        let mut contract = Register::default();
        contract.register(1);
        assert_eq!(
            context.signer_account_id,
            contract.find_member(1)
        );
    }

    #[test]
    fn get_default_register() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Register::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            "Undefined".to_string(),
            contract.find_member(2)
        );
    }
}
