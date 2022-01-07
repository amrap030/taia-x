#if !FA2_TAIA_X_TOKEN
#define FA2_TAIA_X_TOKEN

#include "tzip-12/fa2_interface.mligo"
#include "tzip-12/fa2_errors.mligo"
#include "tzip-12/lib/fa2_operator_lib.mligo"

#include "user_manager/user_manager_interface.mligo"
#include "user_manager/user_manager_role_lib.mligo"

#include "domain_storage/storage_definition.mligo"
#include "entrypoints/entrypoints.mligo"


type nft_entry_points =
    | Fa2 of fa2_entry_points
    | User_manager of user_manager_entry_points
    | Mint of mint_param
    | Update_token_metadata of update_token_metadata_param
    | Buy of buy_param

let fa2_main (param, storage : fa2_entry_points * nft_token_storage)
    : (operation  list) * nft_token_storage =
    match param with
     | Transfer txs_michelson -> fa2_transfer(txs_michelson, storage)
     | Balance_of pm -> fa2_balance(pm, storage)
     | Update_operators updates_michelson -> fa2_update_operators(updates_michelson, storage)

let user_manager_main (param, storage : user_manager_entry_points * nft_token_storage)
    : (operation  list) * nft_token_storage =
    match param with
    | Update_roles updates_michelson -> user_manager_update_roles(updates_michelson, storage)

let main (param, storage : nft_entry_points * nft_token_storage)
      : (operation  list) * nft_token_storage =
    match param with
    | Fa2 fa2 -> fa2_main (fa2, storage)
    | User_manager user_manager -> user_manager_main(user_manager, storage)
    | Mint p -> mint(p,storage)
    | Update_token_metadata p -> update_token_metadata(p, storage)
    | Buy p -> buy(p, storage)

#endif
